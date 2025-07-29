
import type { WidgetTemplate } from '../template-types.ts'

export function getModernFloatingTemplate(): WidgetTemplate {
  return {
    id: 'modern-floating',
    name: 'Modern Floating',
    description: 'Modern design with floating icons that appear on hover from bottom to top',
    html: `
      <!-- Modern Floating Widget -->
      <div id="lovable-modern-floating-widget" style="{{POSITION_STYLE}} bottom: 20px; z-index: 99999; position: fixed;">
        
        <!-- Channels Container - Hidden by default -->
        <div id="lovable-modern-channels" style="position: absolute; bottom: {{BUTTON_SIZE}}px; {{POSITION_CHANNELS_STYLE}} display: none; flex-direction: column; gap: 8px; padding-bottom: 10px;">
          {{MODERN_CHANNELS_HTML}}
        </div>
        
        <!-- Main Button -->
        <button 
          id="lovable-modern-main-btn" 
          style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: {{BUTTON_COLOR}}; border: none; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; z-index: 10;"
          onmouseover="showModernChannels()"
          onmouseout="hideModernChannels()"
        >
          {{BUTTON_ICON}}
        </button>
        
        <!-- Tooltip -->
        <div 
          id="lovable-modern-tooltip" 
          style="{{TOOLTIP_POSITION_STYLE}} background: rgba(0,0,0,0.9); color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap; pointer-events: none; opacity: 0; visibility: hidden; transition: all 0.2s ease; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
        >
          {{TOOLTIP_TEXT}}
        </div>
        
      </div>
    `,
    
    css: `
      #lovable-modern-floating-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      #lovable-modern-main-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      }
      
      .modern-channel-item {
        width: {{CHANNEL_ICON_SIZE}}px;
        height: {{CHANNEL_ICON_SIZE}}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-decoration: none;
        opacity: 0;
        transform: translateY(20px);
        animation: slideUpFadeIn 0.4s ease-out forwards;
      }
      
      .modern-channel-item:nth-child(1) { animation-delay: 0.1s; }
      .modern-channel-item:nth-child(2) { animation-delay: 0.2s; }
      .modern-channel-item:nth-child(3) { animation-delay: 0.3s; }
      .modern-channel-item:nth-child(4) { animation-delay: 0.4s; }
      .modern-channel-item:nth-child(5) { animation-delay: 0.5s; }
      .modern-channel-item:nth-child(6) { animation-delay: 0.6s; }
      
      .modern-channel-item:hover {
        transform: translateY(0) scale(1.1);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      }
      
      .modern-channel-icon {
        font-size: {{CHANNEL_ICON_FONT_SIZE}}px;
        color: white;
      }
      
      @keyframes slideUpFadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideDownFadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
      
      #lovable-modern-channels.hide .modern-channel-item {
        animation: slideDownFadeOut 0.3s ease-out forwards;
      }
      
      /* Tooltip styles */
      #lovable-modern-main-btn:hover + #lovable-modern-tooltip {
        opacity: 1;
        visibility: visible;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .modern-channel-item {
          width: {{MOBILE_CHANNEL_ICON_SIZE}}px;
          height: {{MOBILE_CHANNEL_ICON_SIZE}}px;
        }
        
        .modern-channel-icon {
          font-size: {{MOBILE_CHANNEL_ICON_FONT_SIZE}}px;
        }
      }
    `,
    
    js: `
      console.log('Modern floating widget loading...');
      
      var channelsData = {{CHANNELS_DATA}};
      var showTimeout;
      var hideTimeout;
      var isChannelsVisible = false;
      
      function generateModernChannelsHtml() {
        if (!channelsData || channelsData.length === 0) {
          return '<div style="color: #666; font-size: 12px; padding: 8px; text-align: center;">No channels available</div>';
        }
        
        return channelsData.map(function(channel, index) {
          var platformInfo = getPlatformInfo(channel.type);
          var channelUrl = getChannelUrl(channel);
          var iconHtml = '<i class="' + platformInfo.icon + ' modern-channel-icon"></i>';
          
          return '<a href="' + channelUrl + '" target="_blank" class="modern-channel-item" style="background: ' + platformInfo.color + ';" onclick="openChannel(\'' + channelUrl + '\')">' +
            iconHtml +
          '</a>';
        }).join('');
      }
      
      function showModernChannels() {
        clearTimeout(hideTimeout);
        var channels = document.getElementById('lovable-modern-channels');
        if (channels && channelsData && channelsData.length > 0) {
          showTimeout = setTimeout(function() {
            channels.classList.remove('hide');
            channels.style.display = 'flex';
            isChannelsVisible = true;
          }, 200); // Small delay for better UX
        }
      }
      
      function hideModernChannels() {
        clearTimeout(showTimeout);
        var channels = document.getElementById('lovable-modern-channels');
        if (channels && isChannelsVisible) {
          hideTimeout = setTimeout(function() {
            channels.classList.add('hide');
            setTimeout(function() {
              channels.style.display = 'none';
              channels.classList.remove('hide');
              isChannelsVisible = false;
            }, 300);
          }, 500); // Delay before hiding
        }
      }
      
      function getPlatformInfo(type) {
        var platforms = {
          whatsapp: { icon: 'fab fa-whatsapp', color: '#25d366' },
          telegram: { icon: 'fab fa-telegram-plane', color: '#0088cc' },
          instagram: { icon: 'fab fa-instagram', color: '#e4405f' },
          messenger: { icon: 'fab fa-facebook-messenger', color: '#006aff' },
          viber: { icon: 'fab fa-viber', color: '#665cac' },
          discord: { icon: 'fab fa-discord', color: '#7289da' },
          tiktok: { icon: 'fab fa-tiktok', color: '#000000' },
          youtube: { icon: 'fab fa-youtube', color: '#ff0000' },
          facebook: { icon: 'fab fa-facebook', color: '#1877f2' },
          twitter: { icon: 'fab fa-twitter', color: '#1da1f2' },
          linkedin: { icon: 'fab fa-linkedin', color: '#0077b5' },
          github: { icon: 'fab fa-github', color: '#333333' },
          website: { icon: 'fas fa-globe', color: '#6b7280' },
          email: { icon: 'fas fa-envelope', color: '#ea4335' },
          phone: { icon: 'fas fa-phone', color: '#34d399' },
          custom: { icon: 'fas fa-link', color: '#6b7280' }
        };
        return platforms[type] || platforms.custom;
      }
      
      function getChannelUrl(channel) {
        switch (channel.type) {
          case 'whatsapp':
            return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
          case 'telegram':
            return channel.value.startsWith('http') ? channel.value : 'https://t.me/' + channel.value;
          case 'instagram':
            return channel.value.startsWith('http') ? channel.value : 'https://instagram.com/' + channel.value;
          case 'messenger':
            return channel.value.startsWith('http') ? channel.value : 'https://m.me/' + channel.value;
          case 'email':
            return 'mailto:' + channel.value;
          case 'phone':
            return 'tel:' + channel.value;
          default:
            return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
        }
      }
      
      function openChannel(url) {
        window.open(url, '_blank');
      }
      
      // Initialize when DOM is ready
      function initModernWidget() {
        console.log('Initializing modern floating widget...');
        
        // Generate and insert channels HTML
        var channelsContainer = document.getElementById('lovable-modern-channels');
        if (channelsContainer) {
          channelsContainer.innerHTML = generateModernChannelsHtml();
        }
        
        // Setup hover events for channels container
        if (channelsContainer) {
          channelsContainer.addEventListener('mouseenter', function() {
            clearTimeout(hideTimeout);
          });
          
          channelsContainer.addEventListener('mouseleave', function() {
            hideModernChannels();
          });
        }
        
        // Tooltip functionality
        var button = document.getElementById('lovable-modern-main-btn');
        var tooltip = document.getElementById('lovable-modern-tooltip');
        
        if (button && tooltip && '{{TOOLTIP_DISPLAY}}' === 'hover') {
          button.addEventListener('mouseenter', function() {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
          });
          
          button.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
          });
        }
        
        console.log('Modern floating widget initialized successfully');
      }
      
      // Initialize
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModernWidget);
      } else {
        initModernWidget();
      }
    `
  }
}
