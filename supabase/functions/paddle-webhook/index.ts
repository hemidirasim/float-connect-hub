
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

  try {
    const signature = req.headers.get('paddle-signature');
    const body = await req.text();
    
    console.log('🎯 Webhook received:', {
      method: req.method,
      hasSignature: !!signature,
      bodyLength: body.length,
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(req.headers.entries())
    });

    // Parse the webhook data
    let webhookData;
    try {
      webhookData = JSON.parse(body);
      console.log('📋 Parsed webhook data:', JSON.stringify(webhookData, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse webhook body:', parseError);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }
    
    console.log('📋 Webhook event details:', {
      event_type: webhookData.event_type,
      transaction_id: webhookData.data?.id,
      customer_email: webhookData.data?.customer?.email,
      custom_data: webhookData.data?.custom_data,
      amount: webhookData.data?.details?.totals?.grand_total || webhookData.data?.amount,
      currency: webhookData.data?.currency_code
    });
    
    // Process both completed and paid transactions
    if (webhookData.event_type === 'transaction.completed' || webhookData.event_type === 'transaction.paid') {
      const transaction = webhookData.data;
      const customData = transaction.custom_data || {};
      
      console.log('💳 Processing transaction:', {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.details?.totals?.grand_total || transaction.amount,
        currency: transaction.currency_code,
        customer_email: transaction.customer?.email,
        customData: customData,
        items: transaction.items
      });
      
      // Create service role client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      let userId = customData.user_id;
      let creditsToAdd = parseInt(customData.credits || '0');

      // If missing user_id or credits, try to find user by email and determine credits
      if (!userId || !creditsToAdd) {
        console.log('🔍 Missing user data, attempting to find user by email:', transaction.customer?.email);
        
        if (!transaction.customer?.email) {
          console.error('❌ No customer email provided');
          return new Response('Missing customer email', { 
            status: 400,
            headers: corsHeaders 
          });
        }

        // Find user by email using service role
        const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          console.error('❌ Error fetching users:', usersError);
          return new Response('Error fetching users', { 
            status: 500,
            headers: corsHeaders 
          });
        }

        const foundUser = users?.users?.find(u => u.email === transaction.customer.email);
        
        if (!foundUser) {
          console.error('❌ Could not find user with email:', transaction.customer.email);
          return new Response('User not found', { 
            status: 400,
            headers: corsHeaders 
          });
        }

        console.log('✅ Found user by email:', { id: foundUser.id, email: foundUser.email });
        userId = foundUser.id;

        // Determine credits based on transaction amount
        const amount = parseFloat(transaction.details?.totals?.grand_total || transaction.amount || '0') / 100;
        console.log('💰 Calculating credits for amount:', amount);
        
        if (amount >= 30) creditsToAdd = 800;
        else if (amount >= 20) creditsToAdd = 500;
        else if (amount >= 10) creditsToAdd = 200;
        else if (amount >= 1) creditsToAdd = 10;
        else creditsToAdd = 0;

        console.log('🎯 Determined credits to add:', creditsToAdd);
      }

      if (!creditsToAdd) {
        console.error('❌ No credits to add');
        return new Response('No credits determined', { 
          status: 400,
          headers: corsHeaders 
        });
      }

      // Check if transaction already processed
      console.log('🔍 Checking if transaction already exists:', transaction.id);
      const { data: existingTransaction, error: checkError } = await supabase
        .from('payment_transactions')
        .select('id')
        .eq('paddle_transaction_id', transaction.id)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking existing transaction:', checkError);
      }

      if (existingTransaction) {
        console.log('⚠️ Transaction already processed:', transaction.id);
        return new Response('Already processed', { status: 200, headers: corsHeaders });
      }

      // Record the transaction first
      console.log('💾 Recording transaction in database...');
      const transactionData = {
        user_id: userId,
        paddle_transaction_id: transaction.id,
        product_id: transaction.items?.[0]?.price?.product_id || '',
        amount: parseFloat(transaction.details?.totals?.grand_total || transaction.amount || '0') / 100,
        currency: transaction.currency_code || 'USD',
        credits_purchased: creditsToAdd,
        status: 'completed',
        paddle_checkout_id: transaction.checkout?.id
      };

      console.log('💾 Transaction data to insert:', transactionData);

      const { data: insertedTransaction, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (transactionError) {
        console.error('❌ Error recording transaction:', transactionError);
        return new Response('Database error: ' + transactionError.message, { 
          status: 500,
          headers: corsHeaders 
        });
      }

      console.log('✅ Transaction recorded successfully:', insertedTransaction);

      // Handle user credits
      console.log('🔍 Checking user credits for user:', userId);
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Error fetching current credits:', fetchError);
        return new Response('Error fetching credits: ' + fetchError.message, { 
          status: 500,
          headers: corsHeaders 
        });
      }

      let newBalance;

      if (!currentCredits) {
        // User credits record doesn't exist, create one
        console.log('➕ Creating new user credits record');
        newBalance = 100 + creditsToAdd; // Default 100 + purchased credits
        
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            balance: newBalance,
            total_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating user credits:', insertError);
          return new Response('Error creating credits: ' + insertError.message, { 
            status: 500,
            headers: corsHeaders 
          });
        }

        console.log('✅ Created user credits:', newCredits);
      } else {
        // Update existing credits
        console.log('🔄 Updating existing credits. Current balance:', currentCredits.balance);
        newBalance = currentCredits.balance + creditsToAdd;
        
        const { data: updatedCredits, error: creditsError } = await supabase
          .from('user_credits')
          .update({ 
            balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();

        if (creditsError) {
          console.error('❌ Error updating credits:', creditsError);
          return new Response('Error updating credits: ' + creditsError.message, { 
            status: 500,
            headers: corsHeaders 
          });
        }

        console.log('✅ Updated user credits:', updatedCredits);
      }

      console.log(`🎉 SUCCESS: Added ${creditsToAdd} credits to user ${userId}`);
      console.log(`💰 New balance: ${newBalance}`);
      
      // Send success response
      return new Response(JSON.stringify({
        success: true,
        credits_added: creditsToAdd,
        new_balance: newBalance,
        transaction_id: transaction.id,
        user_id: userId
      }), { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else {
      console.log('ℹ️ Ignoring webhook event type:', webhookData.event_type);
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('💥 Webhook error:', error);
    console.error('📜 Error stack:', error.stack);
    return new Response('Internal error: ' + error.message, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
