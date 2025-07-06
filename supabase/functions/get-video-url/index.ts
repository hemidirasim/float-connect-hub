
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoPath, widgetId } = await req.json()
    
    if (!videoPath || !widgetId) {
      return new Response('Video path and widget ID required', { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify widget exists (basic security check)
    const { data: widget } = await supabaseClient
      .from('widgets')
      .select('id, video_url')
      .eq('id', widgetId)
      .single()

    if (!widget) {
      return new Response('Widget not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate signed URL (expires in 1 hour)
    const { data: signedUrl } = await supabaseClient.storage
      .from('videos')
      .createSignedUrl(videoPath, 3600) // 1 hour expiry

    if (!signedUrl) {
      return new Response('Failed to generate signed URL', { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Generated signed URL for video:', videoPath)

    return new Response(JSON.stringify({ 
      signedUrl: signedUrl.signedUrl,
      expiresIn: 3600 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error generating signed URL:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
