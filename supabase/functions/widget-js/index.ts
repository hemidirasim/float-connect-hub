
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  console.log('Widget-js function called:', req.method, req.url)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    console.log('Full URL:', url.href)
    console.log('Pathname:', url.pathname)
    
    // Extract widget ID from URL - it should be the last part after widget-js/
    const pathParts = url.pathname.split('/').filter(part => part.length > 0)
    console.log('Path parts:', pathParts)
    
    let widgetId = ''
    
    // Find widget-js in the path and get the next part
    const widgetJsIndex = pathParts.findIndex(part => part === 'widget-js')
    if (widgetJsIndex !== -1 && widgetJsIndex + 1 < pathParts.length) {
      widgetId = pathParts[widgetJsIndex + 1]
    }
    
    console.log('Extracted widget ID:', widgetId)

    if (!widgetId || widgetId === 'widget-js') {
      console.log('Invalid or missing widget ID')
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
    console.error('Error in widget-js function:', error)
    return new Response(`console.error('Widget load error: ${error.message}');`, { 
      status: 200, // Return 200 so script loads but shows error
      headers: { ...corsHeaders, 'Content-Type': 'application/javascript' }
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

  // Generate complete widget with full functionality like preview
  return `console.log('Loading widget...');
(function() {
  var config = ${JSON.stringify(config)};
  console.log('Widget config:', config);
  
  // Create widget container
  var widget = document.createElement('div');
  widget.style.cssText = 'position:fixed;' + config.position + ':20px;bottom:20px;z-index:9999;';
  
  // Create button
  var btn = document.createElement('button');
  btn.style.cssText = 'width:60px;height:60px;border-radius:50%;background:' + config.buttonColor + ';border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);position:relative;display:flex;align-items:center;justify-content:center;transition:transform 0.2s;';
  
  // Button hover effect
  btn.addEventListener('mouseenter', function() {
    btn.style.transform = 'scale(1.1)';
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = 'scale(1)';
  });
  
  // Button icon
  if (config.customIconUrl) {
    btn.innerHTML = '<img src="' + config.customIconUrl + '" alt="Contact" style="width:24px;height:24px;border-radius:50%;">';
  } else {
    btn.innerHTML = '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  }
  
  // Tooltip
  if (config.tooltipDisplay === 'always' && config.tooltip) {
    var tooltip = document.createElement('div');
    tooltip.style.cssText = 'position:absolute;' + (config.position === 'left' ? 'left:70px;' : 'right:70px;') + 'bottom:50%;transform:translateY(50%);background:black;color:white;padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;';
    tooltip.textContent = config.tooltip;
    btn.appendChild(tooltip);
  }
  
  widget.appendChild(btn);
  document.body.appendChild(widget);
  console.log('Widget button added to page');
  
  // Click handler - opens modal
  btn.addEventListener('click', function() {
    console.log('Widget button clicked');
    openModal();
  });
  
  // Tooltip hover effect
  if (config.tooltipDisplay === 'hover' && config.tooltip) {
    var hoverTooltip = null;
    btn.addEventListener('mouseenter', function() {
      hoverTooltip = document.createElement('div');
      hoverTooltip.style.cssText = 'position:absolute;' + (config.position === 'left' ? 'left:70px;' : 'right:70px;') + 'bottom:50%;transform:translateY(50%);background:black;color:white;padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;z-index:10000;';
      hoverTooltip.textContent = config.tooltip;
      btn.appendChild(hoverTooltip);
    });
    btn.addEventListener('mouseleave', function() {
      if (hoverTooltip) {
        hoverTooltip.remove();
        hoverTooltip = null;
      }
    });
  }
  
  function openModal() {
    // Create modal backdrop
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;';
    
    // Create modal content
    var content = document.createElement('div');
    content.style.cssText = 'background:white;padding:20px;border-radius:10px;max-width:400px;width:90%;max-height:80vh;overflow-y:auto;transform:scale(0.8);transition:transform 0.2s;';
    
    var html = '<div style="margin:0 0 15px 0;"><h3 style="margin:0;font-size:18px;font-weight:bold;color:#333;">Contact Us</h3></div>';
    
    // Video section (if enabled)
    if (config.videoEnabled && config.videoUrl) {
      html += '<div style="margin-bottom:15px;"><video style="width:100%;height:' + config.videoHeight + 'px;object-fit:cover;object-position:' + config.videoAlignment + ';border-radius:8px;" controls autoplay muted><source src="' + config.videoUrl + '" type="video/mp4">Your browser does not support the video tag.</video></div>';
    }
    
    // Channels section
    if (config.channels && config.channels.length > 0) {
      html += '<div style="max-height:300px;overflow-y:auto;">';
      config.channels.forEach(function(channel) {
        var channelUrl = getChannelUrl(channel);
        var channelIcon = getChannelIcon(channel.type);
        var channelColor = getChannelColor(channel.type);
        
        html += '<div style="display:flex;align-items:center;gap:12px;padding:12px;margin:5px 0;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;transition:background-color 0.2s;text-decoration:none;" onclick="openChannel(\\'' + channelUrl + '\\');" onmouseover="this.style.backgroundColor=\\'#f9fafb\\'" onmouseout="this.style.backgroundColor=\\'white\\'">';
        html += '<div style="width:40px;height:40px;border-radius:50%;background:' + channelColor + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + channelIcon + '</div>';
        html += '<div style="flex:1;min-width:0;"><div style="font-weight:600;font-size:14px;color:#374151;">' + channel.label + '</div><div style="font-size:12px;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + channel.value + '</div></div>';
        html += '<svg style="width:16px;height:16px;color:#9ca3af;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
        html += '</div>';
      });
      html += '</div>';
    }
    
    // Close button
    html += '<div style="margin-top:15px;text-align:center;"><button onclick="closeModal()" style="padding:8px 16px;background:#374151;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;transition:background-color 0.2s;" onmouseover="this.style.backgroundColor=\\'#1f2937\\'" onmouseout="this.style.backgroundColor=\\'#374151\\'">Close</button></div>';
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add global functions for channel interaction
    window.openChannel = function(url) {
      window.open(url, '_blank');
    };
    
    window.closeModal = function() {
      modal.style.opacity = '0';
      content.style.transform = 'scale(0.8)';
      setTimeout(function() {
        if (modal.parentNode) {
          modal.remove();
        }
        delete window.openChannel;
        delete window.closeModal;
      }, 200);
    };
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        window.closeModal();
      }
    });
    
    // Animate in
    setTimeout(function() {
      modal.style.opacity = '1';
      content.style.transform = 'scale(1)';
    }, 10);
    
    console.log('Modal opened');
  }
  
  function getChannelUrl(channel) {
    switch (channel.type) {
      case 'whatsapp':
        return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
      case 'telegram':
        return 'https://t.me/' + channel.value.replace('@', '');
      case 'email':
        return 'mailto:' + channel.value;
      case 'phone':
        return 'tel:' + channel.value;
      case 'instagram':
        return channel.value.startsWith('http') ? channel.value : 'https://instagram.com/' + channel.value.replace('@', '');
      default:
        return channel.value;
    }
  }
  
  function getChannelIcon(type) {
    switch (type) {
      case 'whatsapp':
        return '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/></svg>';
      case 'telegram':
        return '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';
      case 'email':
        return '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>';
      case 'phone':
        return '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>';
      case 'instagram':
        return '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
      default:
        return '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
    }
  }
  
  function getChannelColor(type) {
    switch (type) {
      case 'whatsapp':
        return '#25d366';
      case 'telegram':
        return '#0088cc';
      case 'email':
        return '#ea4335';
      case 'phone':
        return '#22c55e';
      case 'instagram':
        return '#e4405f';
      default:
        return '#6b7280';
    }
  }
  
  console.log('Widget loaded successfully');
})();`
}
