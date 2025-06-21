
import type { WidgetConfig } from './types.ts'
import { defaultWidgetConfig } from './config.ts'
import { getChannelUrl, getChannelIcon, getChannelColor } from './utils.ts'

export function createWidgetConfig(widget: any): WidgetConfig {
  return {
    channels: widget.channels || [],
    buttonColor: widget.button_color || defaultWidgetConfig.buttonColor,
    position: widget.position || defaultWidgetConfig.position,
    tooltip: widget.tooltip || defaultWidgetConfig.tooltip,
    tooltipDisplay: widget.tooltip_display || defaultWidgetConfig.tooltipDisplay,
    customIconUrl: widget.custom_icon_url || defaultWidgetConfig.customIconUrl,
    videoEnabled: widget.video_enabled || defaultWidgetConfig.videoEnabled,
    videoUrl: widget.video_url || defaultWidgetConfig.videoUrl,
    videoHeight: widget.video_height || defaultWidgetConfig.videoHeight,
    videoAlignment: widget.video_alignment || defaultWidgetConfig.videoAlignment,
    useVideoPreview: widget.use_video_preview || false,
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120
  }
}

export function generateWidgetScript(widget: any): string {
  const config = createWidgetConfig(widget)

  console.log('Generating script for config:', JSON.stringify(config, null, 2))

  return `console.log('Loading widget...');
(function() {
  var config = ${JSON.stringify(config)};
  console.log('Widget config:', config);
  
  // Inject CSS styles
  var styles = \`
    .widget-container {
      position: fixed;
      \${config.position}: 20px;
      bottom: 20px;
      z-index: 99999;
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .widget-button {
      width: \${config.buttonSize}px;
      height: \${config.buttonSize}px;
      border-radius: 50%;
      background: \${config.buttonColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      overflow: hidden;
    }
    
    .widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    }
    
    .widget-button video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    
    .tooltip {
      position: absolute;
      \${config.position === 'left' ? 'left: ' + (config.buttonSize + 10) + 'px;' : 'right: ' + (config.buttonSize + 10) + 'px;'}
      bottom: 50%;
      transform: translateY(50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 100000;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }
    
    .tooltip.show {
      opacity: 1;
    }
    
    .tooltip::before {
      content: '';
      position: absolute;
      \${config.position === 'left' ? 'right: -5px;' : 'left: -5px;'}
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      \${config.position === 'left' ? 'border-left: 5px solid rgba(0,0,0,0.8);' : 'border-right: 5px solid rgba(0,0,0,0.8);'}
    }
    
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .modal-backdrop.show {
      opacity: 1;
    }
    
    .modal-content {
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 420px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      transform: scale(0.8);
      transition: transform 0.3s ease;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    .modal-backdrop.show .modal-content {
      transform: scale(1);
    }
    
    .modal-header {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: bold;
      color: #333;
      text-align: center;
    }
    
    .video-container {
      margin-bottom: 20px;
    }
    
    .video-player {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .channels-container {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .channel-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin: 8px 0;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    
    .channel-item:hover {
      background-color: #f9fafb;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .channel-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .channel-info {
      flex: 1;
      min-width: 0;
    }
    
    .channel-label {
      font-weight: 600;
      font-size: 14px;
      color: #374151;
      margin: 0 0 2px 0;
    }
    
    .channel-value {
      font-size: 12px;
      color: #6b7280;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
    }
    
    .close-button {
      margin-top: 20px;
      padding: 10px 20px;
      background: #374151;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
      width: 100%;
    }
    
    .close-button:hover {
      background: #1f2937;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }
    
    .empty-icon {
      width: 32px;
      height: 32px;
      margin: 0 auto 8px;
      opacity: 0.5;
    }
  \`;
  
  // Inject styles
  var styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Create widget container
  var widget = document.createElement('div');
  widget.className = 'widget-container';
  
  // Create button
  var btn = document.createElement('button');
  btn.className = 'widget-button';
  
  // Button content - video preview or icon
  var hasVideo = config.videoEnabled && config.videoUrl;
  var useVideoPreview = config.useVideoPreview;
  
  console.log('Has video:', hasVideo, 'Use video preview:', useVideoPreview, 'Video URL:', config.videoUrl);
  
  if (hasVideo && useVideoPreview && config.videoUrl) {
    // Show video preview in button
    console.log('Creating video element for button preview');
    var video = document.createElement('video');
    video.src = config.videoUrl;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.style.objectPosition = config.videoAlignment === 'top' ? 'top' : 
                                config.videoAlignment === 'bottom' ? 'bottom' : 'center';
    video.addEventListener('loadstart', function() {
      console.log('Video preview started loading');
    });
    video.addEventListener('canplay', function() {
      console.log('Video preview can play');
    });
    video.addEventListener('error', function(e) {
      console.error('Video preview error:', e);
      // Fallback to icon if video fails
      showIconFallback();
    });
    btn.appendChild(video);
  } else {
    // Show icon
    showIconFallback();
  }
  
  function showIconFallback() {
    btn.innerHTML = '';
    var iconHtml = '';
    if (config.customIconUrl) {
      iconHtml = '<img src="' + config.customIconUrl + '" alt="Contact" style="width:24px;height:24px;border-radius:50%;">';
    } else {
      iconHtml = '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
    }
    btn.innerHTML = iconHtml;
  }
  
  // Tooltip
  var tooltip = null;
  if (config.tooltip && config.tooltipDisplay !== 'never') {
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = config.tooltip;
    
    if (config.tooltipDisplay === 'always') {
      tooltip.classList.add('show');
    }
    
    btn.appendChild(tooltip);
  }
  
  widget.appendChild(btn);
  document.body.appendChild(widget);
  console.log('Widget button added to page with video preview:', hasVideo && useVideoPreview);
  
  // Tooltip hover effects
  if (tooltip && config.tooltipDisplay === 'hover') {
    btn.addEventListener('mouseenter', function() {
      tooltip.classList.add('show');
    });
    btn.addEventListener('mouseleave', function() {
      tooltip.classList.remove('show');
    });
  }
  
  // Click handler - opens modal
  btn.addEventListener('click', function() {
    console.log('Widget button clicked');
    openModal();
  });
  
  function openModal() {
    // Create modal backdrop
    var modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    
    // Create modal content
    var content = document.createElement('div');
    content.className = 'modal-content';
    
    var html = '<div class="modal-header">Contact Us</div>';
    
    // Video section (if enabled) - always show full video in modal
    if (config.videoEnabled && config.videoUrl) {
      html += '<div class="video-container">';
      html += '<video class="video-player" style="height:' + config.videoHeight + 'px;object-position:' + config.videoAlignment + ';" controls autoplay muted>';
      html += '<source src="' + config.videoUrl + '" type="video/mp4">';
      html += 'Your browser does not support the video tag.';
      html += '</video>';
      html += '</div>';
    }
    
    // Channels section
    if (config.channels && config.channels.length > 0) {
      html += '<div class="channels-container">';
      config.channels.forEach(function(channel) {
        var channelUrl = getChannelUrl(channel);
        var channelIcon = getChannelIcon(channel.type);
        var channelColor = getChannelColor(channel.type);
        
        html += '<div class="channel-item" onclick="openChannel(\\'' + channelUrl + '\\');">';
        html += '<div class="channel-icon" style="background-color:' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + channel.label + '</div>';
        html += '<div class="channel-value">' + channel.value + '</div>';
        html += '</div>';
        html += '<svg style="width:16px;height:16px;color:#9ca3af;flex-shrink:0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
        html += '</div>';
      });
      html += '</div>';
    } else {
      html += '<div class="empty-state">';
      html += '<svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
      html += '<p>No contact channels available</p>';
      html += '</div>';
    }
    
    // Close button
    html += '<button class="close-button" onclick="closeModal()">Close</button>';
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add global functions for channel interaction
    window.openChannel = function(url) {
      window.open(url, '_blank');
    };
    
    window.closeModal = function() {
      modal.classList.remove('show');
      setTimeout(function() {
        if (modal.parentNode) {
          modal.remove();
        }
        delete window.openChannel;
        delete window.closeModal;
      }, 300);
    };
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        window.closeModal();
      }
    });
    
    // Animate in
    setTimeout(function() {
      modal.classList.add('show');
    }, 10);
    
    console.log('Modal opened');
  }
  
  function getChannelUrl(channel) {
    ${generateChannelUrlFunction()}
  }
  
  function getChannelIcon(type) {
    ${generateChannelIconFunction()}
  }
  
  function getChannelColor(type) {
    ${generateChannelColorFunction()}
  }
  
  console.log('Widget loaded successfully with video preview support');
})();`
}

function generateChannelUrlFunction(): string {
  return `switch (channel.type) {
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
    }`
}

function generateChannelIconFunction(): string {
  return `switch (type) {
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
    }`
}

function generateChannelColorFunction(): string {
  return `switch (type) {
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
    }`
}
