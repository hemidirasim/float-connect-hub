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
      const customerEmail = transaction.customer?.email || transaction.billing_details?.email;
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

      // Determine credits based on amount or from custom_data
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
        console.log('🎯 Credits calculated from amount:', creditsToAdd);
      }

      if (creditsToAdd === 0) {
        console.warn('⚠️ No credits determined for amount:', amountInDollars);
        return new Response('No credits to add', { 
          status: 400, 
          headers: corsHeaders 
        });
      }

      // Check for duplicate transaction in both tables
      const { data: existingTransaction } = await supabase
        .from('payment_transactions')
        .select('id')
        .eq('paddle_transaction_id', transactionId)
        .maybeSingle();
        
      const { data: existingNewTransaction } = await supabase
        .from('transactions')
        .select('id')
        .eq('transaction_id', transactionId)
        .maybeSingle();

      if (existingTransaction || existingNewTransaction) {
        console.log('⚠️ Transaction already processed:', transactionId);
        return new Response('Transaction already processed', { 
          status: 200, 
          headers: corsHeaders 
        });
      }

      // Record transaction in new transactions table
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
          raw_event: webhookData.event_type
        }
      };

      console.log('💾 Inserting transaction record to new table:', newTransactionRecord);

      const { data: insertedNewTransaction, error: newTransactionError } = await supabase
        .from('transactions')
        .insert(newTransactionRecord)
        .select()
        .single();

      if (newTransactionError) {
        console.error('❌ Error inserting to new transactions table:', newTransactionError);
        
        // If the new table doesn't exist yet, fall back to the old table
        if (newTransactionError.message.includes('relation "transactions" does not exist')) {
          console.log('⚠️ New transactions table not found, falling back to payment_transactions');
          
          // Record transaction in old payment_transactions table
          const transactionRecord = {
            user_id: user.id,
            paddle_transaction_id: transactionId,
            product_id: transaction.items?.[0]?.price?.product?.id || customData.product_id || '',
            amount: amountInDollars,
            currency: transaction.currency_code || 'USD',
            credits_purchased: creditsToAdd,
            status: 'completed',
            paddle_checkout_id: transaction.checkout_id || customData.checkout_id || null,
            paddle_subscription_id: transaction.subscription_id || null
          };

          console.log('💾 Inserting transaction record to old table:', transactionRecord);

          const { data: insertedTransaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .insert(transactionRecord)
            .select()
            .single();

          if (transactionError) {
            console.error('❌ Error inserting transaction to old table:', transactionError);
            return new Response('Database error: ' + transactionError.message, { 
              status: 500, 
              headers: corsHeaders 
            });
          }

          console.log('✅ Transaction recorded in old table:', insertedTransaction.id);
        } else {
          return new Response('Database error: ' + newTransactionError.message, { 
            status: 500, 
            headers: corsHeaders 
          });
        }
      } else {
        console.log('✅ Transaction recorded in new table:', insertedNewTransaction.id);
      }

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
          .update({ 
            balance: newBalance,
            updated_at: new Date().toISOString()
          })
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
    } 
    // Handle legacy Paddle webhook format
    else if (webhookData.alert_name === 'payment_succeeded') {
      console.log('💳 Processing legacy payment_succeeded event');
      
      const transactionId = webhookData.p_order_id || webhookData.order_id;
      const customerEmail = webhookData.email || webhookData.customer_email;
      const productId = webhookData.p_product_id || webhookData.product_id;
      const amountInDollars = parseFloat(webhookData.p_sale_gross || webhookData.amount);
      
      console.log('📋 Legacy transaction details:', {
        id: transactionId,
        email: customerEmail,
        product_id: productId,
        amount: amountInDollars
      });
      
      if (!customerEmail) {
        console.error('❌ No customer email found in legacy transaction');
        return new Response('Missing customer email', { 
          status: 400, 
          headers: corsHeaders 
        });
      }
      
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
      
      // Determine credits based on amount
      let creditsToAdd = 0;
      if (amountInDollars >= 30) creditsToAdd = 800;
      else if (amountInDollars >= 20) creditsToAdd = 500;
      else if (amountInDollars >= 10) creditsToAdd = 200;
      else if (amountInDollars >= 1) creditsToAdd = 10;
      
      console.log('🎯 Legacy credits calculation:', creditsToAdd);
      
      if (creditsToAdd === 0) {
        console.warn('⚠️ No credits determined for legacy amount:', amountInDollars);
        return new Response('No credits to add', { 
          status: 400, 
          headers: corsHeaders 
        });
      }
      
      // Try to insert into new transactions table first
      try {
        const newTransactionRecord = {
          user_id: user.id,
          transaction_id: transactionId,
          email: customerEmail,
          amount: amountInDollars,
          currency: webhookData.currency || 'USD',
          status: 'completed',
          product_id: productId || '',
          credits_added: creditsToAdd,
          metadata: {
            checkout_id: webhookData.checkout_id,
            subscription_id: webhookData.subscription_id,
            raw_event: webhookData.alert_name
          }
        };
        
        const { data: insertedNewTransaction, error: newTransactionError } = await supabase
          .from('transactions')
          .insert(newTransactionRecord)
          .select()
          .single();
          
        if (!newTransactionError) {
          console.log('✅ Legacy transaction recorded in new table:', insertedNewTransaction.id);
        } else {
          console.log('⚠️ Could not insert into new table, falling back to old table');
          
          // Check for duplicate transaction
          const { data: existingTransaction } = await supabase
            .from('payment_transactions')
            .select('id')
            .eq('paddle_transaction_id', transactionId)
            .maybeSingle();

          if (existingTransaction) {
            console.log('⚠️ Legacy transaction already processed:', transactionId);
            return new Response('Transaction already processed', { 
              status: 200, 
              headers: corsHeaders 
            });
          }
          
          // Record transaction
          const transactionRecord = {
            user_id: user.id,
            paddle_transaction_id: transactionId,
            product_id: productId || '',
            amount: amountInDollars,
            currency: webhookData.currency || 'USD',
            credits_purchased: creditsToAdd,
            status: 'completed',
            paddle_checkout_id: webhookData.checkout_id || null,
            paddle_subscription_id: webhookData.subscription_id || null
          };
          
          console.log('💾 Inserting legacy transaction record:', transactionRecord);
          
          const { data: insertedTransaction, error: transactionError } = await supabase
            .from('payment_transactions')
            .insert(transactionRecord)
            .select()
            .single();

          if (transactionError) {
            console.error('❌ Error inserting legacy transaction:', transactionError);
            return new Response('Database error: ' + transactionError.message, { 
              status: 500, 
              headers: corsHeaders 
            });
          }
          
          console.log('✅ Legacy transaction recorded in old table:', insertedTransaction.id);
        }
      } catch (error) {
        console.error('❌ Error handling legacy transaction:', error);
        return new Response('Error handling legacy transaction: ' + error.message, { 
          status: 500, 
          headers: corsHeaders 
        });
      }
      
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
          console.error('❌ Error creating user credits for legacy payment:', insertError);
          return new Response('Error creating credits', { 
            status: 500, 
            headers: corsHeaders 
          });
        }
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
          console.error('❌ Error updating user credits for legacy payment:', updateError);
          return new Response('Error updating credits', { 
            status: 500, 
            headers: corsHeaders 
          });
        }
      }
      
      console.log('🎉 SUCCESS: Legacy payment processed successfully');
      
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
      console.log('ℹ️ Ignoring event type:', webhookData.event_type || webhookData.alert_name);
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