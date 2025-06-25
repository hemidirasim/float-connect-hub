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
    const paddleEnvironment = 'production'; // Set to production
    
    console.log('Paddle environment:', paddleEnvironment);
    console.log('Paddle API token exists:', !!paddleApiToken);
    
    if (!paddleApiToken) {
      console.error('PADDLE_API_TOKEN environment variable not set');
      throw new Error('Paddle API token not configured');
    }

    // Use Paddle Transactions API (v1) for production
    const paddleApiUrl = 'https://api.paddle.com/transactions';

    console.log('Using Paddle API URL:', paddleApiUrl);
    console.log('Creating checkout with data:', {
      productId,
      credits,
      userEmail: user.email,
      userId: user.id
    });

    // Create Paddle transaction using v1 API format
    const requestBody = {
      items: [{
        price_id: productId,
        quantity: 1
      }],
      customer: {
        email: user.email
      },
      custom_data: {
        user_id: user.id,
        credits: credits.toString(),
        product_id: productId
      },
      checkout: {
        success_url: `https://hiclient.co/dashboard?success=true`
      }
    };

    console.log('Paddle request body:', JSON.stringify(requestBody, null, 2));

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
    
    console.log('Paddle transaction created successfully:', paddleData);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        checkout_url: paddleData.data.checkout?.url || paddleData.data.url,
        transaction_id: paddleData.data.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

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