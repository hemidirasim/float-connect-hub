
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, WIDGET_CACHE_TIME } from './config.ts'
import { extractWidgetId } from './utils.ts'
import { getWidget, recordWidgetView } from './database.ts'
import { generateWidgetScriptWithTemplate } from './widget-generator.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  console.log('Widget-js function called:', req.method, req.url)
  
  // CORS headers for all responses
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

    // Create Supabase client - NO auth required for public widget access
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

    console.log('Widget loaded from database:', {
      name: widget.name,
      id: widget.id,
      template_id: widget.template_id,
      channels: widget.channels?.length || 0,
      button_color: widget.button_color,
      position: widget.position,
      updated_at: widget.updated_at
    })

    // Add cache busting based on widget update time
    const lastModified = new Date(widget.updated_at).toUTCString()
    const etag = `"${widgetId}-${widget.updated_at}"`

    // Handle HEAD requests for update checking
    if (req.method === 'HEAD') {
      console.log('HEAD request for update check')
      return new Response(null, {
        headers: {
          ...corsHeaders,
          'Last-Modified': lastModified,
          'ETag': etag,
          'Cache-Control': 'no-cache',
          'X-Widget-Version': widget.updated_at,
          'X-Widget-Template': widget.template_id || 'default'
        }
      })
    }

    // Record widget view - continue even if this fails
    try {
      const viewResult = await recordWidgetView(
        widgetId,
        req.headers.get('x-forwarded-for') || 'unknown',
        req.headers.get('user-agent') || 'unknown'
      )
      
      if (!viewResult?.success) {
        console.log('Credits check failed, but widget will still load:', viewResult)
        // Don't block widget loading - just log the issue
      }
    } catch (viewError) {
      console.log('View recording failed, but widget will still load:', viewError)
      // Continue with widget generation even if view recording fails
    }

    // Generate widget JavaScript using template_id from database
    const widgetScript = await generateWidgetScriptWithTemplate(widget, supabaseClient)
    
    console.log('Widget script generation completed:', {
      templateUsed: widget.template_id || 'default',
      scriptLength: widgetScript.length,
      widgetName: widget.name
    })

    return new Response(widgetScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript',
        'Cache-Control': `public, max-age=${WIDGET_CACHE_TIME}`,
        'Last-Modified': lastModified,
        'ETag': etag,
        // Add debug headers for troubleshooting
        'X-Widget-Version': widget.updated_at,
        'X-Widget-Template': widget.template_id || 'default',
        'X-Widget-Name': widget.name
      }
    })

  } catch (error) {
    console.error('Error in widget-js function:', error)
    // Return valid JavaScript even on error
    const errorScript = `console.error('Widget load error: ${error.message}');`
    return new Response(errorScript, { 
      status: 200, // Return 200 so script loads
      headers: { ...corsHeaders, 'Content-Type': 'application/javascript' }
    })
  }
})
