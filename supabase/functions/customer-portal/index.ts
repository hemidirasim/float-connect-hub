
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔧 Customer portal function called');
    
    const body = await req.text();
    let requestData = {};
    
    if (body) {
      try {
        requestData = JSON.parse(body);
      } catch (parseError) {
        console.warn('Failed to parse request body:', parseError);
      }
    }
    
    console.log('Request data:', requestData);

    // Get Paddle API credentials
    const paddleApiKey = Deno.env.get('PADDLE_API_KEY');
    const paddleApiToken = Deno.env.get('PADDLE_API_TOKEN');
    
    if (!paddleApiKey && !paddleApiToken) {
      console.error('Missing Paddle API credentials');
      return new Response(JSON.stringify({
        success: false,
        error: 'Paddle API credentials not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const apiToken = paddleApiToken || paddleApiKey;
    
    // Handle different actions
    const action = (requestData as any)?.action;
    const customerEmail = (requestData as any)?.customer_email;
    
    if (!customerEmail) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Customer email is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'cancel_existing_subscriptions') {
      console.log('🚫 Canceling existing subscriptions for:', customerEmail);
      
      try {
        // Find customer by email
        const customerResponse = await fetch('https://api.paddle.com/customers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!customerResponse.ok) {
          console.log('Customer lookup failed, might not exist yet');
          return new Response(JSON.stringify({
            success: true,
            message: 'No existing customer found'
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        const customerData = await customerResponse.json();
        const customers = customerData.data || [];
        const customer = customers.find((c: any) => c.email === customerEmail);
        
        if (!customer) {
          console.log('No customer found with email:', customerEmail);
          return new Response(JSON.stringify({
            success: true,
            message: 'No existing customer found'
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Find active subscriptions for this customer
        const subscriptionsResponse = await fetch('https://api.paddle.com/subscriptions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (subscriptionsResponse.ok) {
          const subscriptionsData = await subscriptionsResponse.json();
          const allSubscriptions = subscriptionsData.data || [];
          const activeSubscriptions = allSubscriptions.filter((sub: any) => 
            sub.customer_id === customer.id && sub.status === 'active'
          );
          
          // Cancel each active subscription
          for (const subscription of activeSubscriptions) {
            try {
              const cancelResponse = await fetch(`https://api.paddle.com/subscriptions/${subscription.id}/cancel`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  effective_from: 'immediately'
                })
              });
              
              if (cancelResponse.ok) {
                console.log('✅ Successfully cancelled subscription:', subscription.id);
              } else {
                const errorData = await cancelResponse.text();
                console.error('❌ Failed to cancel subscription:', subscription.id, errorData);
              }
            } catch (cancelError) {
              console.error('❌ Error canceling subscription:', subscription.id, cancelError);
            }
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Existing subscriptions processed'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        console.error('Error canceling subscriptions:', error);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to cancel existing subscriptions'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Default: Create customer portal session
    const returnUrl = (requestData as any)?.return_url || 'https://hiclient.co/dashboard';
    
    try {
      console.log('📋 Creating customer portal session for:', customerEmail);
      
      // Find the customer by email
      const customerResponse = await fetch('https://api.paddle.com/customers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('Failed to fetch customers:', errorText);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to find customer. Please make a purchase first.'
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const customerData = await customerResponse.json();
      const customers = customerData.data || [];
      const customer = customers.find((c: any) => c.email === customerEmail);
      
      if (!customer) {
        console.log('No customer found for portal session');
        return new Response(JSON.stringify({
          success: false,
          error: 'No customer found. Please make a purchase first.'
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      console.log('Found customer:', customer.id);
      
      // Create customer portal session - using correct endpoint
      const portalResponse = await fetch('https://api.paddle.com/customer-portal-sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_id: customer.id,
          return_url: returnUrl
        })
      });
      
      if (!portalResponse.ok) {
        const errorText = await portalResponse.text();
        console.error('Failed to create portal session:', errorText);
        return new Response(JSON.stringify({
          success: false,
          error: 'Failed to create customer portal session'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const portalData = await portalResponse.json();
      console.log('Portal session created successfully');
      
      if (!portalData.data?.url) {
        console.error('No portal URL in response:', portalData);
        return new Response(JSON.stringify({
          success: false,
          error: 'Portal URL not received from Paddle'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Customer portal session created',
        portal_url: portalData.data.url
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error creating customer portal:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to create customer portal session: ' + error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('💥 Customer portal error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error: ' + error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
