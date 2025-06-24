
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
    
    console.log('Webhook received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      bodyLength: body.length
    });

    // Parse the webhook data
    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (parseError) {
      console.error('Failed to parse webhook body:', parseError);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }
    
    console.log('Webhook event type:', webhookData.event_type);
    console.log('Webhook data:', JSON.stringify(webhookData, null, 2));
    
    // Process both completed and paid transactions
    if (webhookData.event_type === 'transaction.completed' || webhookData.event_type === 'transaction.paid') {
      const transaction = webhookData.data;
      const customData = transaction.custom_data || {};
      
      console.log('Processing transaction:', {
        id: transaction.id,
        status: transaction.status,
        customData: customData
      });
      
      if (!customData.user_id || !customData.credits) {
        console.error('Missing user_id or credits in custom data:', customData);
        return new Response('Missing user data', { 
          status: 400,
          headers: corsHeaders 
        });
      }

      // Create service role client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Check if transaction already processed
      const { data: existingTransaction } = await supabase
        .from('payment_transactions')
        .select('id')
        .eq('paddle_transaction_id', transaction.id)
        .single();

      if (existingTransaction) {
        console.log('Transaction already processed:', transaction.id);
        return new Response('Already processed', { status: 200, headers: corsHeaders });
      }

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: customData.user_id,
          paddle_transaction_id: transaction.id,
          product_id: transaction.items?.[0]?.price?.product_id || '',
          amount: parseFloat(transaction.details?.totals?.grand_total || transaction.amount || '0') / 100,
          currency: transaction.currency_code || 'USD',
          credits_purchased: parseInt(customData.credits),
          status: 'completed',
          paddle_checkout_id: transaction.checkout?.id
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        return new Response('Database error', { 
          status: 500,
          headers: corsHeaders 
        });
      }

      console.log('Transaction recorded successfully');

      // Get current user credits or create if doesn't exist
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', customData.user_id)
        .single();

      let newBalance;
      const creditsToAdd = parseInt(customData.credits);

      if (fetchError && fetchError.code === 'PGRST116') {
        // User credits record doesn't exist, create one
        console.log('Creating new user credits record');
        newBalance = creditsToAdd;
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: customData.user_id,
            balance: newBalance,
            total_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating user credits:', insertError);
          return new Response('Error creating credits', { 
            status: 500,
            headers: corsHeaders 
          });
        }
      } else if (fetchError) {
        console.error('Error fetching current credits:', fetchError);
        return new Response('Error fetching credits', { 
          status: 500,
          headers: corsHeaders 
        });
      } else {
        // Update existing credits
        newBalance = currentCredits.balance + creditsToAdd;
        const { error: creditsError } = await supabase
          .from('user_credits')
          .update({ 
            balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', customData.user_id);

        if (creditsError) {
          console.error('Error updating credits:', creditsError);
          return new Response('Error updating credits', { 
            status: 500,
            headers: corsHeaders 
          });
        }
      }

      console.log(`Successfully added ${creditsToAdd} credits to user ${customData.user_id}`);
      console.log(`New balance: ${newBalance}`);
    } else {
      console.log('Ignoring webhook event type:', webhookData.event_type);
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    console.error('Error stack:', error.stack);
    return new Response('Internal error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
