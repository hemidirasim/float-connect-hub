
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  console.log('Widget request received:', req.method, req.url)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const widgetId = url.pathname.split('/').pop()
    console.log('Widget ID extracted:', widgetId)

    if (!widgetId || widgetId === 'widget-js') {
      console.log('Invalid widget ID')
      return new Response('Widget ID required', { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    // Fetch widget data
    console.log('Fetching widget from database...')
    const { data: widget, error } = await supabaseClient
      .from('widgets')
      .select('*')
      .eq('id', widgetId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response('Widget not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    if (!widget) {
      console.log('Widget not found in database')
      return new Response('Widget not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      })
    }

    console.log('Widget found:', widget.name, 'Channels:', widget.channels?.length || 0)

    // Record widget view and check credits
    const { data: viewResult } = await supabaseClient.rpc('record_widget_view', {
      p_widget_id: widgetId,
      p_ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      p_user_agent: req.headers.get('user-agent') || 'unknown'
    })

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
    console.error('Error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    })
  }
})

function generateWidgetScript(widget: any): string {
  const config = {
    channels: widget.channels || [],
    buttonColor: widget.button_color || '#25d366',
    position: widget.position || 'right',
    tooltip: widget.tooltip || 'Contact us!',
    tooltipDisplay: widget.tooltip_display || 'hover',
    customIconUrl: widget.custom_icon_url || '',
    videoEnabled: widget.video_enabled || false,
    videoUrl: widget.video_url || '',
    videoHeight: widget.video_height || 200,
    videoAlignment: widget.video_alignment || 'center'
  }

  console.log('Generating script for config:', JSON.stringify(config, null, 2))

  // Simple single WhatsApp button for single WhatsApp channel
  if (config.channels.length === 1 && config.channels[0].type === 'whatsapp') {
    const whatsappNumber = config.channels[0].value.replace(/[^0-9]/g, '')
    return `console.log('Loading WhatsApp widget...');
(function() {
  var btn = document.createElement('div');
  btn.style.cssText = 'position:fixed;${config.position}:20px;bottom:20px;z-index:9999;';
  btn.innerHTML = '<a href="https://wa.me/${whatsappNumber}" target="_blank" style="display:block;width:60px;height:60px;background:${config.buttonColor};border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.3);text-decoration:none;"><svg style="width:24px;height:24px;margin:18px;" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/></svg></a>';
  document.body.appendChild(btn);
  console.log('WhatsApp widget loaded successfully');
})();`
  }

  // Multi-channel widget
  return `console.log('Loading multi-channel widget...');
(function() {
  var config = ${JSON.stringify(config)};
  console.log('Widget config:', config);
  
  var widget = document.createElement('div');
  widget.style.cssText = 'position:fixed;' + config.position + ':20px;bottom:20px;z-index:9999;';
  
  var btn = document.createElement('button');
  btn.style.cssText = 'width:60px;height:60px;border-radius:50%;background:' + config.buttonColor + ';border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);position:relative;';
  
  btn.innerHTML = config.customIconUrl ? 
    '<img src="' + config.customIconUrl + '" alt="Contact" style="width:24px;height:24px;border-radius:50%;">' :
    '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  
  if (config.tooltipDisplay === 'always') {
    btn.innerHTML += '<div style="position:absolute;' + (config.position === 'left' ? 'left:70px;' : 'right:70px;') + 'bottom:50%;transform:translateY(50%);background:black;color:white;padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;">' + config.tooltip + '</div>';
  }
  
  widget.appendChild(btn);
  document.body.appendChild(widget);
  console.log('Widget button added to page');
  
  btn.addEventListener('click', function() {
    console.log('Widget button clicked');
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
    
    var content = document.createElement('div');
    content.style.cssText = 'background:white;padding:20px;border-radius:10px;max-width:400px;width:90%;max-height:80vh;overflow-y:auto;';
    
    var html = '<h3 style="margin:0 0 15px 0;">Contact Us</h3>';
    
    if (config.videoEnabled && config.videoUrl) {
      html += '<video style="width:100%;height:' + config.videoHeight + 'px;object-fit:cover;object-position:' + config.videoAlignment + ';border-radius:8px;margin-bottom:15px;" controls autoplay><source src="' + config.videoUrl + '" type="video/mp4"></video>';
    }
    
    config.channels.forEach(function(channel) {
      var url = channel.type === 'whatsapp' ? 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '') :
                channel.type === 'telegram' ? 'https://t.me/' + channel.value.replace('@', '') :
                channel.type === 'email' ? 'mailto:' + channel.value :
                channel.type === 'phone' ? 'tel:' + channel.value : channel.value;
      html += '<div style="padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;cursor:pointer;" onclick="window.open(\\'' + url + '\\', \\'_blank\\')"><strong>' + channel.label + '</strong><br><small>' + channel.value + '</small></div>';
    });
    
    html += '<button onclick="this.closest(\\'[style*=\"position:fixed\"]\\'). remove()" style="margin-top:15px;padding:8px 16px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">Close</button>';
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    console.log('Modal opened');
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
  });
  
  console.log('Multi-channel widget loaded successfully');
})();`
}
