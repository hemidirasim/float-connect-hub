
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    console.log('Setting up daily blog cron job...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create or update the cron job to run daily at 9 AM
    const cronQuery = `
      SELECT cron.schedule(
        'daily-blog-generation',
        '0 9 * * *',
        $$
        SELECT
          net.http_post(
              url:='${supabaseUrl}/functions/v1/generate-blog-with-grok',
              headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseServiceKey}"}'::jsonb,
              body:='{"scheduled": true}'::jsonb
          ) as request_id;
        $$
      );
    `;

    const { error } = await supabase.rpc('exec', { query: cronQuery });

    if (error) {
      console.error('Error setting up cron job:', error);
      throw new Error(`Failed to setup cron job: ${error.message}`);
    }

    console.log('Daily blog cron job setup successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Günlük blog cron job uğurla quruldu',
      schedule: 'Hər gün səhər saat 9:00-da'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in setup-daily-blog-cron function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
