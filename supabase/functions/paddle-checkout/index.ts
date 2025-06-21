
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
    const { productId, credits } = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: `Bearer ${authHeader}` } }
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Authentication failed');
    }

    const paddleApiKey = Deno.env.get('PADDLE_API_KEY');
    if (!paddleApiKey) {
      throw new Error('Paddle API key not configured');
    }

    // Create Paddle checkout
    const paddleResponse = await fetch('https://api.paddle.com/checkout-sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          product_id: productId,
          quantity: 1
        }],
        customer_email: user.email,
        custom_data: {
          user_id: user.id,
          credits: credits.toString()
        },
        success_url: `${req.headers.get('origin')}/dashboard?success=true`,
        cancel_url: `${req.headers.get('origin')}/dashboard?cancelled=true`
      })
    });

    if (!paddleResponse.ok) {
      const errorText = await paddleResponse.text();
      console.error('Paddle API error:', errorText);
      throw new Error(`Paddle API error: ${paddleResponse.status}`);
    }

    const paddleData = await paddleResponse.json();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        checkout_url: paddleData.data.url,
        checkout_id: paddleData.data.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error creating Paddle checkout:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
