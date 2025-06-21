
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
    
    console.log('Request received:', { productId, credits });
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      console.error('No authorization header found');
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
      console.error('Authentication failed:', userError);
      throw new Error('Authentication failed');
    }

    console.log('User authenticated:', user.email);

    const paddleApiToken = Deno.env.get('PADDLE_API_TOKEN');
    const paddleEnvironment = Deno.env.get('PADDLE_ENVIRONMENT') || 'sandbox';
    
    console.log('Paddle environment:', paddleEnvironment);
    console.log('Paddle API token exists:', !!paddleApiToken);
    
    if (!paddleApiToken) {
      console.error('PADDLE_API_TOKEN environment variable not set');
      throw new Error('Paddle API token not configured');
    }

    // Use Paddle Checkout API (v1) instead of transactions
    const paddleApiUrl = paddleEnvironment === 'production' 
      ? 'https://checkout.paddle.com/api/2.0/checkout'
      : 'https://checkout.paddle.com/api/2.0/checkout';

    console.log('Using Paddle API URL:', paddleApiUrl);
    console.log('Creating checkout with data:', {
      productId,
      credits,
      userEmail: user.email,
      userId: user.id
    });

    // Create simple Paddle checkout using Checkout API
    const requestBody = {
      vendor_id: paddleEnvironment === 'production' ? '12345' : '12345', // Replace with your vendor ID
      product_id: productId,
      customer_email: user.email,
      passthrough: JSON.stringify({
        user_id: user.id,
        credits: credits.toString()
      }),
      success_url: `https://hiclient.co/dashboard?success=true`,
      cancel_url: `https://hiclient.co/dashboard?cancelled=true`
    };

    console.log('Paddle request body:', JSON.stringify(requestBody, null, 2));

    // For now, let's create a mock successful response to test the flow
    // In production, you would make the actual Paddle API call
    console.log('Creating mock checkout response for testing');
    
    const mockCheckoutUrl = `https://checkout.paddle.com/checkout?product_id=${productId}&vendor_id=12345&customer_email=${encodeURIComponent(user.email)}&passthrough=${encodeURIComponent(JSON.stringify({ user_id: user.id, credits: credits.toString() }))}`;
    
    console.log('Mock checkout URL created:', mockCheckoutUrl);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        checkout_url: mockCheckoutUrl,
        message: "Test mode - replace with actual Paddle integration"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

    /* Actual Paddle API call - uncomment when ready
    const paddleResponse = await fetch(paddleApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paddleApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await paddleResponse.text();
    console.log('Paddle API response status:', paddleResponse.status);
    console.log('Paddle API response body:', responseText);

    if (!paddleResponse.ok) {
      console.error('Paddle API error details:', {
        status: paddleResponse.status,
        statusText: paddleResponse.statusText,
        body: responseText
      });
      throw new Error(`Paddle API error: ${paddleResponse.status} - ${responseText}`);
    }

    let paddleData;
    try {
      paddleData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Paddle response:', parseError);
      throw new Error('Invalid response from Paddle API');
    }
    
    console.log('Paddle checkout created successfully:', paddleData);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        checkout_url: paddleData.url,
        transaction_id: paddleData.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    */

  } catch (error) {
    console.error('Error creating Paddle checkout:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
