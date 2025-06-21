
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './config.ts'
import { extractWidgetId } from './utils.ts'
import { getWidget, recordWidgetView } from './database.ts'
import { generateWidgetScript } from './widget-generator.ts'

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

    // Fetch widget data
    const widget = await getWidget(widgetId)

    if (!widget) {
      console.log('Widget not found in database')
      return new Response('Widget not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    console.log('Widget found:', widget.name, 'Channels:', widget.channels?.length || 0)

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

    console.log('Credits check passed, generating widget script...')

    // Generate widget JavaScript
    const widgetScript = generateWidgetScript(widget)
    
    console.log('Widget script generated, length:', widgetScript.length)

    return new Response(widgetScript, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
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
