
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  console.log('🚀 Webhook received:', {
    method: req.method,
    url: req.url,
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
        event_id: webhookData.event_id
      });
    } catch (parseError) {
      console.error('❌ Failed to parse webhook JSON:', parseError.message);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON payload'
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables');
      return new Response(JSON.stringify({
        success: false,
        error: 'Server configuration error'
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle transaction completed events
    if (webhookData.event_type === 'transaction.completed') {
      console.log('💳 Processing transaction.completed event');
      
      const transaction = webhookData.data;
      const transactionId = transaction.id;
      
      console.log('📋 Transaction details:', {
        id: transactionId,
        status: transaction.status,
        customer: transaction.customer,
        amount: transaction.details?.totals?.total || transaction.totals?.total
      });

      // Extract customer email
      let customerEmail = null;
      if (transaction.customer?.email) {
        customerEmail = transaction.customer.email;
      } else if (transaction.billing_details?.email) {
        customerEmail = transaction.billing_details.email;
      }
      
      const customData = transaction.custom_data || {};
      
      console.log('👤 Customer info:', {
        email: customerEmail,
        customData: customData
      });

      if (!customerEmail) {
        console.error('❌ No customer email found');
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing customer email'
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      // Find user by email
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('❌ Error fetching users:', usersError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Error fetching users'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }

      const user = users.users.find(u => u.email === customerEmail);
      
      if (!user) {
        console.error('❌ User not found for email:', customerEmail);
        return new Response(JSON.stringify({
          success: false,
          error: 'User not found for email: ' + customerEmail
        }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      console.log('✅ Found user:', { id: user.id, email: user.email });

      // Calculate amount and credits
      let totalAmount = 0;
      let amountInDollars = 0;

      if (transaction.details?.totals?.total) {
        totalAmount = transaction.details.totals.total;
        amountInDollars = parseInt(totalAmount) / 100;
      } else if (transaction.totals?.total) {
        totalAmount = transaction.totals.total;
        amountInDollars = parseInt(totalAmount) / 100;
      }
      
      console.log('💰 Amount calculation:', {
        totalCents: totalAmount,
        totalDollars: amountInDollars
      });

      // Determine credits
      let creditsToAdd = 0;
      
      if (customData.credits) {
        creditsToAdd = parseInt(customData.credits, 10);
      } else {
        // Fallback to amount-based calculation
        if (amountInDollars >= 30) creditsToAdd = 800;
        else if (amountInDollars >= 20) creditsToAdd = 500;
        else if (amountInDollars >= 10) creditsToAdd = 200;
        else if (amountInDollars >= 1) creditsToAdd = 10;
      }

      console.log('🎯 Credits to add:', creditsToAdd);

      if (creditsToAdd === 0) {
        console.warn('⚠️ No credits determined');
        return new Response(JSON.stringify({
          success: false,
          error: 'No credits to add'
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
          message: 'Transaction already processed'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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
          custom_data: customData,
          raw_event: webhookData.event_type,
          paddle_data: transaction
        }
      };

      console.log('💾 Inserting transaction record');

      const { data: insertedTransaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(newTransactionRecord)
        .select()
        .single();

      if (transactionError) {
        console.error('❌ Error inserting transaction:', transactionError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Database error: ' + transactionError.message
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
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
        newBalance = 100 + creditsToAdd;
        
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
            error: 'Error creating credits'
          }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        console.log('✅ Created new user credits:', newBalance);
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
            error: 'Error updating credits'
          }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        console.log('✅ Updated user credits to:', newBalance);
      }

      console.log('🎉 SUCCESS: Payment processed successfully');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Payment processed successfully',
        transaction_id: transactionId,
        credits_added: creditsToAdd,
        new_balance: newBalance
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.log('ℹ️ Ignoring event type:', webhookData.event_type);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Event type not handled: ' + webhookData.event_type
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error('💥 Webhook processing error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error: ' + error.message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
