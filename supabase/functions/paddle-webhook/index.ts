import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
        data_structure: webhookData.data ? Object.keys(webhookData.data) : 'no data'
      });
    } catch (parseError) {
      console.error('❌ Failed to parse webhook JSON:', parseError.message);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON payload'
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle transaction completed events
    if (webhookData.event_type === 'transaction.completed') {
      console.log('💳 Processing transaction.completed event');
      
      const transaction = webhookData.data;
      const transactionId = transaction.id;
      
      console.log('📋 Full transaction structure:', {
        id: transactionId,
        status: transaction.status,
        customer: transaction.customer,
        billing_details: transaction.billing_details,
        items: transaction.items,
        custom_data: transaction.custom_data,
        full_transaction: transaction
      });

      // Extract customer email - try multiple possible locations
      let customerEmail = null;
      
      // Try customer.email first
      if (transaction.customer?.email) {
        customerEmail = transaction.customer.email;
        console.log('📧 Found email in customer.email:', customerEmail);
      }
      // Try billing_details.email
      else if (transaction.billing_details?.email) {
        customerEmail = transaction.billing_details.email;
        console.log('📧 Found email in billing_details.email:', customerEmail);
      }
      // Try items[0].billing_details.email
      else if (transaction.items?.[0]?.billing_details?.email) {
        customerEmail = transaction.items[0].billing_details.email;
        console.log('📧 Found email in items[0].billing_details.email:', customerEmail);
      }
      // Try custom_data.user_email
      else if (transaction.custom_data?.user_email) {
        customerEmail = transaction.custom_data.user_email;
        console.log('📧 Found email in custom_data.user_email:', customerEmail);
      }
      
      const customData = transaction.custom_data || {};
      
      console.log('👤 Customer info extracted:', {
        email: customerEmail,
        customData: customData,
        customer_object: transaction.customer,
        billing_details: transaction.billing_details
      });

      if (!customerEmail) {
        console.error('❌ No customer email found in any location');
        console.error('Full transaction for debugging:', JSON.stringify(transaction, null, 2));
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing customer email - please check transaction data structure'
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
          error: 'Error fetching users'
        }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const user = users.users.find(u => u.email === customerEmail);
      
      if (!user) {
        console.error('❌ User not found for email:', customerEmail);
        return new Response(JSON.stringify({
          success: false,
          error: 'User not found for email: ' + customerEmail
        }), { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
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

      // Determine credits - FIXED to prevent double crediting
      let creditsToAdd = 0;
      
      if (customData.credits) {
        // Use credits from custom data if available
        creditsToAdd = parseInt(customData.credits, 10);
        console.log('🎯 Using credits from custom_data:', creditsToAdd);
      } else {
        // Fallback to amount-based calculation but ensure no double crediting
        if (amountInDollars >= 30) creditsToAdd = 800;
        else if (amountInDollars >= 20) creditsToAdd = 500;
        else if (amountInDollars >= 10) creditsToAdd = 200;
        else if (amountInDollars >= 1) creditsToAdd = 10;
        console.log('🎯 Using amount-based credits calculation:', creditsToAdd);
      }

      console.log('🎯 Final credits to add:', creditsToAdd);

      if (creditsToAdd === 0) {
        console.warn('⚠️ No credits determined');
        return new Response(JSON.stringify({
          success: false,
          error: 'No credits to add'
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
          message: 'Transaction already processed'
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
        }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      console.log('✅ Transaction recorded:', insertedTransaction.id);
      
      // Credits will be automatically added by the trigger function
      console.log('🎯 Credits will be added automatically by trigger function');

      console.log('🎉 SUCCESS: Payment processed successfully');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Payment processed successfully',
        transaction_id: transactionId,
        credits_added: creditsToAdd
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      console.log('ℹ️ Ignoring event type:', webhookData.event_type);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Event type not handled: ' + webhookData.event_type
      }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('💥 Webhook processing error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error: ' + error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
