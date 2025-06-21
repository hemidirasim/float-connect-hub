
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

  // LivePreview.tsx-dəki eyni strukturu və stilləri istifadə edək
  return `console.log('Loading widget...');
(function() {
  var config = ${JSON.stringify(config)};
  console.log('Widget config:', config);
  
  // Video mövcudluğunu yoxlayaq - LivePreview.tsx-dəki kimi
  var hasVideo = config.videoUrl && config.videoUrl.trim() !== '';
  
  // TailwindCSS-ə bənzər inline stillər - LivePreview.tsx-dəki Card komponentinin stilləri
  var styles = \`
    /* Widget Container - LivePreview.tsx-dəki kimi */
    .hiclient-widget-container {
      position: fixed;
      \${config.position}: 20px;
      bottom: 20px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    /* Button - LivePreview.tsx-dəki ButtonComponent kimi */
    .hiclient-widget-button {
      width: \${config.buttonSize}px;
      height: \${config.buttonSize}px;
      border-radius: 50%;
      background: \${config.buttonColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
    }
    
    /* Hover effect - LivePreview.tsx-dəki kimi */
    .hiclient-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    /* Tooltip - LivePreview.tsx-dəki TooltipContent kimi */
    .hiclient-tooltip {
      position: absolute;
      \${config.position === 'left' ? 'left: ' + (config.buttonSize + 10) + 'px;' : 'right: ' + (config.buttonSize + 10) + 'px;'}
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 100000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      pointer-events: none;
    }
    
    .hiclient-tooltip.show {
      opacity: 1;
      visibility: visible;
    }
    
    .hiclient-tooltip::before {
      content: '';
      position: absolute;
      \${config.position === 'left' ? 'right: -5px;' : 'left: -5px;'}
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      \${config.position === 'left' ? 'border-left: 5px solid rgba(0, 0, 0, 0.9);' : 'border-right: 5px solid rgba(0, 0, 0, 0.9);'}
    }
    
    /* Modal - LivePreview.tsx-dəki DialogContent kimi */
    .hiclient-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    .hiclient-modal-backdrop.show {
      opacity: 1;
      visibility: visible;
    }
    
    .hiclient-modal-content {
      background: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 28rem;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      transform: scale(0.95);
      transition: transform 0.3s ease;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .hiclient-modal-backdrop.show .hiclient-modal-content {
      transform: scale(1);
    }
    
    /* Modal Header - LivePreview.tsx-dəki DialogTitle kimi */
    .hiclient-modal-header {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      text-align: center;
      line-height: 1.4;
    }
    
    /* Video Container - LivePreview.tsx-dəki video section kimi */
    .hiclient-video-container {
      margin-bottom: 20px;
    }
    
    .hiclient-video-player {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
    }
    
    /* Channels Container - LivePreview.tsx-dəki channels grid kimi */
    .hiclient-channels-container {
      max-height: 300px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    /* Channel Item - LivePreview.tsx-dəki channel item kimi */
    .hiclient-channel-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      background: white;
    }
    
    .hiclient-channel-item:hover {
      background-color: #f9fafb;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    /* Channel Icon - LivePreview.tsx-dəki icon div kimi */
    .hiclient-channel-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    /* Channel Info - LivePreview.tsx-dəki channel info kimi */
    .hiclient-channel-info {
      flex: 1;
      min-width: 0;
    }
    
    .hiclient-channel-label {
      font-weight: 500;
      font-size: 14px;
      color: #374151;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }
    
    .hiclient-channel-value {
      font-size: 12px;
      color: #6b7280;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      line-height: 1.3;
    }
    
    /* External Link Icon - LivePreview.tsx-dəki ExternalLink icon kimi */
    .hiclient-external-icon {
      width: 16px;
      height: 16px;
      color: #9ca3af;
      flex-shrink: 0;
    }
    
    /* Empty State - LivePreview.tsx-dəki empty state kimi */
    .hiclient-empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
    }
    
    .hiclient-empty-icon {
      width: 32px;
      height: 32px;
      margin: 0 auto 12px;
      opacity: 0.5;
    }
    
    /* Scrollbar Styling */
    .hiclient-channels-container::-webkit-scrollbar {
      width: 6px;
    }
    
    .hiclient-channels-container::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    
    .hiclient-channels-container::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    
    .hiclient-channels-container::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  \`;
  
  // Stilləri inject edək
  var styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Widget container yaradaq
  var widget = document.createElement('div');
  widget.className = 'hiclient-widget-container';
  
  // Button yaradaq - LivePreview.tsx-dəki ButtonComponent kimi
  var btn = document.createElement('button');
  btn.className = 'hiclient-widget-button';
  
  // Button content - LivePreview.tsx-dəki getButtonIcon kimi
  var iconHtml = '';
  if (config.customIconUrl && config.customIconUrl.trim() !== '') {
    iconHtml = '<img src="' + config.customIconUrl + '" alt="Custom icon" style="width:24px;height:24px;object-fit:cover;">';
  } else {
    // Default MessageCircle icon - LivePreview.tsx-dəki kimi
    iconHtml = '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  }
  btn.innerHTML = iconHtml;
  
  // Tooltip - LivePreview.tsx-dəki renderTooltipMessage kimi
  var tooltip = null;
  if (config.tooltip && config.tooltip.trim() !== '' && config.tooltipDisplay !== 'never') {
    tooltip = document.createElement('div');
    tooltip.className = 'hiclient-tooltip';
    tooltip.textContent = config.tooltip;
    
    if (config.tooltipDisplay === 'always') {
      tooltip.classList.add('show');
    }
    
    btn.appendChild(tooltip);
  }
  
  widget.appendChild(btn);
  document.body.appendChild(widget);
  console.log('Widget button added to page');
  
  // Tooltip hover effects - LivePreview.tsx-dəki kimi
  if (tooltip && config.tooltipDisplay === 'hover') {
    btn.addEventListener('mouseenter', function() {
      tooltip.classList.add('show');
    });
    btn.addEventListener('mouseleave', function() {
      tooltip.classList.remove('show');
    });
  }
  
  // Click handler - LivePreview.tsx-dəki modal açma kimi
  btn.addEventListener('click', function() {
    console.log('Widget button clicked');
    openModal();
  });
  
  function openModal() {
    // Modal backdrop yaradaq
    var modal = document.createElement('div');
    modal.className = 'hiclient-modal-backdrop';
    
    // Modal content yaradaq
    var content = document.createElement('div');
    content.className = 'hiclient-modal-content';
    
    var html = '<div class="hiclient-modal-header">Contact Us</div>';
    
    // Video section - LivePreview.tsx-dəki video section kimi
    if (hasVideo) {
      html += '<div class="hiclient-video-container">';
      html += '<video class="hiclient-video-player" style="height:' + config.videoHeight + 'px;object-position:' + getVideoObjectPosition() + ';" controls autoplay>';
      html += '<source src="' + config.videoUrl + '" type="video/mp4">';
      html += 'Your browser does not support the video tag.';
      html += '</video>';
      html += '</div>';
    }
    
    // Channels section - LivePreview.tsx-dəki channels grid kimi
    if (config.channels && config.channels.length > 0) {
      html += '<div class="hiclient-channels-container">';
      config.channels.forEach(function(channel) {
        var channelUrl = getChannelUrl(channel);
        var channelIcon = getChannelIcon(channel.type);
        var channelColor = getChannelColor(channel.type);
        
        html += '<div class="hiclient-channel-item" onclick="openChannel(\\'' + channelUrl + '\\');">';
        html += '<div class="hiclient-channel-icon" style="background-color:' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="hiclient-channel-info">';
        html += '<div class="hiclient-channel-label">' + channel.label + '</div>';
        html += '<div class="hiclient-channel-value">' + channel.value + '</div>';
        html += '</div>';
        html += '<svg class="hiclient-external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
        html += '</div>';
      });
      html += '</div>';
    }
    
    // Empty state - LivePreview.tsx-dəki empty state kimi
    if ((!config.channels || config.channels.length === 0) && !hasVideo) {
      html += '<div class="hiclient-empty-state">';
      html += '<svg class="hiclient-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';
      html += '<p style="margin:0;font-size:14px;">No contact channels available</p>';
      html += '</div>';
    }
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Global functions for channel interaction
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
    
    // ESC key to close
    var escHandler = function(e) {
      if (e.key === 'Escape') {
        window.closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Animate in
    setTimeout(function() {
      modal.classList.add('show');
    }, 10);
    
    console.log('Modal opened');
  }
  
  // Video alignment helper function - LivePreview.tsx-dəki getVideoObjectPosition kimi
  function getVideoObjectPosition() {
    switch (config.videoAlignment) {
      case 'top':
        return 'top';
      case 'bottom':
        return 'bottom';
      case 'center':
      default:
        return 'center';
    }
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
  
  console.log('Widget loaded successfully');
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
        return '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
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
