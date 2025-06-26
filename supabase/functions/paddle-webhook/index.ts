
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
      bodyPreview: body.substring(0, 1000),
      fullBody: body
    });

    // Parse webhook data
    let webhookData;
    try {
      webhookData = JSON.parse(body);
      console.log('✅ Successfully parsed webhook data:', {
        event_type: webhookData.event_type,
        event_id: webhookData.event_id,
        occurred_at: webhookData.occurred_at,
        data_keys: Object.keys(webhookData.data || {}),
        full_data: JSON.stringify(webhookData, null, 2)
      });
    } catch (parseError) {
      console.error('❌ Failed to parse webhook JSON:', parseError.message);
      console.error('Raw body that failed to parse:', body);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON payload',
        received_body: body 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      supabaseUrl: supabaseUrl
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables');
      return new Response(JSON.stringify({
        success: false,
        error: 'Server configuration error'
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test database connection
    try {
      const { data: testData, error: testError } = await supabase
        .from('transactions')
        .select('count')
        .limit(1);
      
      console.log('🔍 Database connection test:', {
        success: !testError,
        error: testError?.message,
        testData: testData
      });
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
    }

    // Handle transaction completed events
    if (webhookData.event_type === 'transaction.completed') {
      console.log('💳 Processing transaction.completed event');
      
      const transaction = webhookData.data;
      const transactionId = transaction.id;
      
      console.log('📋 Transaction details:', {
        id: transactionId,
        status: transaction.status,
        customer_id: transaction.customer_id,
        customer: transaction.customer,
        billing_details: transaction.billing_details,
        items: transaction.items,
        custom_data: transaction.custom_data,
        currency_code: transaction.currency_code,
        details: transaction.details,
        full_transaction: JSON.stringify(transaction, null, 2)
      });

      // Extract customer info - try multiple fields
      let customerEmail = null;
      if (transaction.customer?.email) {
        customerEmail = transaction.customer.email;
      } else if (transaction.billing_details?.email) {
        customerEmail = transaction.billing_details.email;
      } else if (transaction.customer_email) {
        customerEmail = transaction.customer_email;
      }
      
      const customData = transaction.custom_data || {};
      
      console.log('👤 Customer info extracted:', {
        email: customerEmail,
        customData: customData,
        customer_object: transaction.customer,
        billing_details: transaction.billing_details
      });

      if (!customerEmail) {
        console.error('❌ No customer email found in transaction');
        console.error('Available customer data:', {
          customer: transaction.customer,
          billing_details: transaction.billing_details,
          raw_transaction: JSON.stringify(transaction, null, 2)
        });
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing customer email',
          transaction_data: transaction
        }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Find user by email
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('❌ Error fetching users:', usersError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Error fetching users: ' + usersError.message
        }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log('👥 Users search:', {
        totalUsers: users.users.length,
        searchingForEmail: customerEmail,
        availableEmails: users.users.map(u => u.email)
      });

      const user = users.users.find(u => u.email === customerEmail);
      
      if (!user) {
        console.error('❌ User not found for email:', customerEmail);
        console.error('Available users:', users.users.map(u => ({ id: u.id, email: u.email })));
        return new Response(JSON.stringify({
          success: false,
          error: 'User not found for email: ' + customerEmail,
          available_users: users.users.map(u => u.email)
        }), { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log('✅ Found user:', { id: user.id, email: user.email });

      // Calculate total amount and credits
      let totalAmount = 0;
      let amountInDollars = 0;

      if (transaction.details?.totals?.total) {
        totalAmount = transaction.details.totals.total;
        amountInDollars = parseInt(totalAmount) / 100;
      } else if (transaction.amount) {
        amountInDollars = parseFloat(transaction.amount);
        totalAmount = amountInDollars * 100;
      } else if (transaction.totals?.total) {
        totalAmount = transaction.totals.total;
        amountInDollars = parseInt(totalAmount) / 100;
      }
      
      console.log('💰 Amount calculation:', {
        totalCents: totalAmount,
        totalDollars: amountInDollars,
        details_totals: transaction.details?.totals,
        direct_amount: transaction.amount,
        totals_total: transaction.totals?.total
      });

      // Determine credits based on custom_data or amount
      let creditsToAdd = 0;
      
      if (customData.credits) {
        creditsToAdd = parseInt(customData.credits, 10);
        console.log('🎯 Credits from custom_data:', creditsToAdd);
      } else {
        // Fallback to amount-based calculation
        if (amountInDollars >= 30) creditsToAdd = 800;
        else if (amountInDollars >= 20) creditsToAdd = 500;
        else if (amountInDollars >= 10) creditsToAdd = 200;
        else if (amountInDollars >= 1) creditsToAdd = 10;
        console.log('🎯 Credits calculated from amount:', {
          amount: amountInDollars,
          credits: creditsToAdd
        });
      }

      if (creditsToAdd === 0) {
        console.warn('⚠️ No credits determined for amount:', amountInDollars);
        console.warn('Full transaction for debugging:', JSON.stringify(transaction, null, 2));
        return new Response(JSON.stringify({
          success: false,
          error: 'No credits to add',
          amount: amountInDollars,
          custom_data: customData
        }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check for duplicate transaction
      const { data: existingTransaction } = await supabase
        .from('transactions')
        .select('id')
        .eq('transaction_id', transactionId)
        .maybeSingle();

      if (existingTransaction) {
        console.log('⚠️ Transaction already processed:', transactionId);
        return new Response(JSON.stringify({
          success: true,
          message: 'Transaction already processed',
          transaction_id: transactionId
        }), { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Record transaction
      const newTransactionRecord = {
        user_id: user.id,
        transaction_id: transactionId,
        email: customerEmail,
        amount: amountInDollars,
        currency: transaction.currency_code || 'USD',
        status: 'completed',
        product_id: transaction.items?.[0]?.price?.product?.id || customData.product_id || '',
        credits_added: creditsToAdd,
        metadata: {
          checkout_id: transaction.checkout_id || customData.checkout_id,
          subscription_id: transaction.subscription_id,
          custom_data: customData,
          raw_event: webhookData.event_type,
          full_webhook_data: webhookData
        }
      };

      console.log('💾 Inserting transaction record:', JSON.stringify(newTransactionRecord, null, 2));

      const { data: insertedTransaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(newTransactionRecord)
        .select()
        .single();

      if (transactionError) {
        console.error('❌ Error inserting transaction:', transactionError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Database error: ' + transactionError.message,
          transaction_data: newTransactionRecord
        }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log('✅ Transaction recorded:', insertedTransaction.id);

      // Update user credits
      const { data: currentCredits } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('💳 Current user credits:', currentCredits);

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
          return new Response(JSON.stringify({
            success: false,
            error: 'Error creating credits: ' + insertError.message
          }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        console.log('✅ Created new user credits with balance:', newBalance);
      } else {
        // Update existing credits
        newBalance = currentCredits.balance + creditsToAdd;
        
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ 
            balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('❌ Error updating user credits:', updateError);
          return new Response(JSON.stringify({
            success: false,
            error: 'Error updating credits: ' + updateError.message
          }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        console.log('✅ Updated user credits to balance:', newBalance);
      }

      console.log('🎉 SUCCESS: Payment processed successfully');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Payment processed successfully',
        transaction_id: transactionId,
        user_id: user.id,
        credits_added: creditsToAdd,
        new_balance: newBalance,
        debug_info: {
          webhook_event: webhookData.event_type,
          customer_email: customerEmail,
          amount: amountInDollars,
          credits: creditsToAdd
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      console.log('ℹ️ Ignoring event type:', webhookData.event_type);
      console.log('📋 Full webhook data for ignored event:', JSON.stringify(webhookData, null, 2));
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Event type not handled: ' + webhookData.event_type,
        event_data: webhookData
      }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('💥 Webhook processing error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error: ' + error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
