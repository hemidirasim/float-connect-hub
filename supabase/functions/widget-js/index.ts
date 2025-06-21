
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, WIDGET_CACHE_TIME } from './config.ts'
import { extractWidgetId } from './utils.ts'
import { getWidget, recordWidgetView } from './database.ts'
import { generateWidgetScriptWithTemplate } from './widget-generator.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  console.log('Widget-js function called:', req.method, req.url)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    console.log('Full URL:', url.href)
    console.log('Pathname:', url.pathname)
    
    // Extract widget ID from URL
    const widgetId = extractWidgetId(url)
    console.log('Extracted widget ID:', widgetId)

    if (!widgetId || widgetId === 'widget-js') {
      console.log('Invalid or missing widget ID')
      return new Response('Widget ID required', { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    // Create Supabase client for template fetching
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch widget data
    const widget = await getWidget(widgetId)

    if (!widget) {
      console.log('Widget not found in database')
      return new Response('Widget not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    console.log('Widget found:', widget.name, 'Channels:', widget.channels?.length || 0, 'Template ID:', widget.template_id)

    // Record widget view and check credits
    const viewResult = await recordWidgetView(
      widgetId,
      req.headers.get('x-forwarded-for') || 'unknown',
      req.headers.get('user-agent') || 'unknown'
    )

    if (!viewResult?.success) {
      console.log('Credits check failed:', viewResult)
      return new Response('Widget unavailable - insufficient credits', { 
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    console.log('Credits check passed, generating widget script with template...')

    // Generate widget JavaScript with proper template
    const widgetScript = await generateWidgetScriptWithTemplate(widget, supabaseClient)
    
    console.log('Widget script generated, length:', widgetScript.length)

    // Add cache busting based on widget update time
    const lastModified = new Date(widget.updated_at).toUTCString()
    const etag = `"${widgetId}-${widget.updated_at}"`

    return new Response(widgetScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript',
        'Cache-Control': `public, max-age=${WIDGET_CACHE_TIME}`,
        'Last-Modified': lastModified,
        'ETag': etag,
        // Add version header for debugging
        'X-Widget-Version': widget.updated_at,
        'X-Widget-Template': widget.template_id || 'default'
      }
    })

  } catch (error) {
    console.error('Error in widget-js function:', error)
    return new Response(`console.error('Widget load error: ${error.message}');`, { 
      status: 200, // Return 200 so script loads but shows error
      headers: { ...corsHeaders, 'Content-Type': 'application/javascript' }
    })
  }
})
