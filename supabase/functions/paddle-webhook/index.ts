
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, paddle-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('🚀 Webhook received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    timestamp: new Date().toISOString()
  });

  try {
    // Get the raw body first
    const body = await req.text();
    console.log('📥 Raw webhook body received:', {
      bodyLength: body.length,
      bodyPreview: body.substring(0, 500)
    });

    // Parse webhook data
    let webhookData;
    try {
      webhookData = JSON.parse(body);
      console.log('✅ Successfully parsed webhook data:', {
        event_type: webhookData.event_type,
        event_id: webhookData.event_id,
        data_keys: Object.keys(webhookData.data || {})
      });
    } catch (parseError) {
      console.error('❌ Failed to parse webhook JSON:', parseError.message);
      return new Response('Invalid JSON payload', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables');
      return new Response('Server configuration error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test database connection
    try {
      const { data: testData, error: testError } = await supabase
        .from('user_credits')
        .select('count')
        .limit(1);
      
      console.log('🔍 Database connection test:', {
        success: !testError,
        error: testError?.message
      });
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
    }

    // Handle transaction completed events (latest Paddle API)
    if (webhookData.event_type === 'transaction.completed') {
      console.log('💳 Processing transaction.completed event');
      
      const transaction = webhookData.data;
      const transactionId = transaction.id;
      
      console.log('📋 Transaction details:', {
        id: transactionId,
        status: transaction.status,
        customer_id: transaction.customer_id,
        billing_details: transaction.billing_details,
        items: transaction.items?.length || 0,
        custom_data: transaction.custom_data
      });

      // Extract customer info
      const customerEmail = transaction.billing_details?.email;
      const customData = transaction.custom_data || {};
      
      if (!customerEmail) {
        console.error('❌ No customer email found in transaction');
        return new Response('Missing customer email', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      console.log('👤 Customer info:', {
        email: customerEmail,
        customData: customData
      });

      // Find user by email
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('❌ Error fetching users:', usersError);
        return new Response('Error fetching users', { 
          status: 500, 
          headers: corsHeaders 
        });
      }

      const user = users.users.find(u => u.email === customerEmail);
      
      if (!user) {
        console.error('❌ User not found:', customerEmail);
        return new Response('User not found', { 
          status: 404, 
          headers: corsHeaders 
        });
      }

      console.log('✅ Found user:', { id: user.id, email: user.email });

      // Calculate total amount and credits
      const totalAmount = transaction.details?.totals?.total || '0';
      const amountInDollars = parseInt(totalAmount) / 100;
      
      console.log('💰 Amount calculation:', {
        totalCents: totalAmount,
        totalDollars: amountInDollars
      });

      // Determine credits based on amount
      let creditsToAdd = 0;
      if (amountInDollars >= 30) creditsToAdd = 800;
      else if (amountInDollars >= 20) creditsToAdd = 500;
      else if (amountInDollars >= 10) creditsToAdd = 200;
      else if (amountInDollars >= 1) creditsToAdd = 10;

      console.log('🎯 Credits to add:', creditsToAdd);

      if (creditsToAdd === 0) {
        console.warn('⚠️ No credits determined for amount:', amountInDollars);
        return new Response('No credits to add', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      // Check for duplicate transaction
      const { data: existingTransaction } = await supabase
        .from('payment_transactions')
        .select('id')
        .eq('paddle_transaction_id', transactionId)
        .maybeSingle();

      if (existingTransaction) {
        console.log('⚠️ Transaction already processed:', transactionId);
        return new Response('Transaction already processed', { 
          status: 200, 
          headers: corsHeaders 
        });
      }

      // Record transaction
      const transactionRecord = {
        user_id: user.id,
        paddle_transaction_id: transactionId,
        product_id: transaction.items?.[0]?.price?.product?.id || '',
        amount: amountInDollars,
        currency: transaction.currency_code || 'USD',
        credits_purchased: creditsToAdd,
        status: 'completed'
      };

      console.log('💾 Inserting transaction record:', transactionRecord);

      const { data: insertedTransaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert(transactionRecord)
        .select()
        .single();

      if (transactionError) {
        console.error('❌ Error inserting transaction:', transactionError);
        return new Response('Database error: ' + transactionError.message, { 
          status: 500, 
          headers: corsHeaders 
        });
      }

      console.log('✅ Transaction recorded:', insertedTransaction.id);

      // Update user credits
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      let newBalance;
      if (!currentCredits) {
        // Create new credits record
        newBalance = 100 + creditsToAdd; // Default 100 + purchased
        
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            balance: newBalance,
            total_spent: 0
          });

        if (insertError) {
          console.error('❌ Error creating user credits:', insertError);
          return new Response('Error creating credits', { 
            status: 500, 
            headers: corsHeaders 
          });
        }

        console.log('✅ Created new user credits with balance:', newBalance);
      } else {
        // Update existing credits
        newBalance = currentCredits.balance + creditsToAdd;
        
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ balance: newBalance })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('❌ Error updating user credits:', updateError);
          return new Response('Error updating credits', { 
            status: 500, 
            headers: corsHeaders 
          });
        }

        console.log('✅ Updated user credits to balance:', newBalance);
      }

      console.log('🎉 SUCCESS: Payment processed successfully');
      
      return new Response(JSON.stringify({
        success: true,
        transaction_id: transactionId,
        user_id: user.id,
        credits_added: creditsToAdd,
        new_balance: newBalance
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } else {
      console.log('ℹ️ Ignoring event type:', webhookData.event_type);
      return new Response('Event type not handled', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

  } catch (error) {
    console.error('💥 Webhook processing error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response('Internal server error: ' + error.message, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
