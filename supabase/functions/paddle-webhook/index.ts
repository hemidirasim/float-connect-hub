
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('paddle-signature');
    const body = await req.text();
    
    console.log('Webhook received:', body);
    console.log('Paddle signature:', signature);

    // Parse the webhook data
    const webhookData = JSON.parse(body);
    
    // Only process completed transactions
    if (webhookData.event_type === 'transaction.completed') {
      const transaction = webhookData.data;
      const customData = transaction.custom_data || {};
      
      console.log('Transaction data:', transaction);
      console.log('Custom data:', customData);
      
      if (!customData.user_id || !customData.credits) {
        console.error('Missing custom data in webhook');
        return new Response('Missing user data', { status: 400 });
      }

      // Create service role client
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: customData.user_id,
          paddle_transaction_id: transaction.id,
          product_id: transaction.items[0]?.product_id || '',
          amount: parseFloat(transaction.details.totals.grand_total),
          currency: transaction.currency_code,
          credits_purchased: parseInt(customData.credits),
          status: 'completed',
          paddle_checkout_id: transaction.checkout?.id
        });

      if (transactionError) {
        console.error('Error recording transaction:', transactionError);
        return new Response('Database error', { status: 500 });
      }

      // Get current user credits
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('balance')
        .eq('user_id', customData.user_id)
        .single();

      if (fetchError) {
        console.error('Error fetching current credits:', fetchError);
        return new Response('Error fetching credits', { status: 500 });
      }

      // Update user credits
      const { error: creditsError } = await supabase
        .from('user_credits')
        .update({ 
          balance: currentCredits.balance + parseInt(customData.credits),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', customData.user_id);

      if (creditsError) {
        console.error('Error updating credits:', creditsError);
        return new Response('Error updating credits', { status: 500 });
      }

      console.log(`Added ${customData.credits} credits to user ${customData.user_id}`);
      console.log(`New balance: ${currentCredits.balance + parseInt(customData.credits)}`);
    }

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
