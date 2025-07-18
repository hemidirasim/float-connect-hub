import type { WidgetTemplate } from '../template-types.ts'

export function getElegantTemplate(): WidgetTemplate {
  return {
    id: 'elegant',
    name: 'Elegant Design',
    description: 'Modern elegant design with hover-based channel dropdown and smooth animations',
    html: `
      <div id="lovable-widget-elegant" class="lovable-widget-elegant">
        <!-- Main Button -->
        <div class="lovable-main-button" id="lovable-main-btn">
          {{BUTTON_ICON}}
        </div>
        
        <!-- Tooltip -->
        <div class="lovable-tooltip" id="lovable-tooltip" style="display: none;">
          {{TOOLTIP_TEXT}}
        </div>
        
        <!-- Channels Container - Shows on HOVER -->
        <div class="lovable-channels-container" id="lovable-channels">
          <!-- Greeting Message -->
          <div class="lovable-greeting">
            {{GREETING_MESSAGE}}
          </div>
          
          <!-- Video Content -->
          {{VIDEO_CONTENT}}
          
          <!-- Channels List -->
          <div class="lovable-channels-list">
            {{CHANNELS_HTML}}
          </div>
        </div>
      </div>
    `,
    css: `
      .lovable-widget-elegant {
        position: fixed;
        bottom: 20px;
        {{POSITION_STYLE}}
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .lovable-main-button {
        width: {{BUTTON_SIZE}}px;
        height: {{BUTTON_SIZE}}px;
        border-radius: 50%;
        background: {{BUTTON_COLOR}};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 1000001;
      }
      
      .lovable-main-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      }
      
      .lovable-main-button svg {
        width: 24px;
        height: 24px;
        color: white;
        fill: currentColor;
      }
      
      .lovable-main-button img {
        width: 24px;
        height: 24px;
        border-radius: 4px;
      }
      
      .lovable-tooltip {
        position: absolute;
        {{TOOLTIP_POSITION_STYLE}}
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        z-index: 1000000;
      }
      
      .lovable-main-button:hover + .lovable-tooltip,
      .lovable-tooltip.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .lovable-channels-container {
        position: absolute;
        bottom: calc({{BUTTON_SIZE}}px + 15px);
        {{POSITION_STYLE}}
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        padding: 20px;
        min-width: 280px;
        max-width: 320px;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000000;
        pointer-events: none;
      }
      
      /* HOVER BEHAVIOR - Show channels on hover */
      .lovable-widget-elegant:hover .lovable-channels-container {
        opacity: 1;
        transform: translateY(0) scale(1);
        visibility: visible;
        pointer-events: auto;
      }
      
      .lovable-greeting {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 16px;
        white-space: pre-line;
        line-height: 1.4;
      }
      
      .lovable-channels-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .lovable-channel-button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        text-decoration: none;
        color: #374151;
        font-weight: 500;
        transition: all 0.2s ease;
        background: white;
        transform: translateX(0);
      }
      
      .lovable-channel-button:hover {
        background: #f9fafb;
        border-color: {{BUTTON_COLOR}};
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .lovable-channel-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .lovable-channel-icon svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
      
      /* Channel group styles */
      .lovable-channel-group {
        position: relative;
      }
      
      .lovable-group-trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: white;
        position: relative;
      }
      
      .lovable-group-trigger:hover {
        background: #f9fafb;
        border-color: {{BUTTON_COLOR}};
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .lovable-group-dropdown {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        background: #f9fafb;
        border-radius: 8px;
        margin-top: 8px;
        border: 1px solid #e5e7eb;
      }
      
      .lovable-group-dropdown.show {
        max-height: 300px;
      }
      
      .lovable-group-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        text-decoration: none;
        color: #374151;
        transition: all 0.2s ease;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .lovable-group-item:last-child {
        border-bottom: none;
      }
      
      .lovable-group-item:hover {
        background: #f1f5f9;
      }
      
      .lovable-group-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #3b82f6;
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 18px;
        text-align: center;
        line-height: 1.2;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      }
      
      /* Mobile Responsive */
      @media (max-width: 768px) {
        .lovable-channels-container {
          min-width: 260px;
          max-width: 300px;
          left: 20px !important;
          right: 20px !important;
          transform-origin: bottom center;
        }
        
        /* On mobile, click instead of hover */
        .lovable-widget-elegant:hover .lovable-channels-container {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        
        .lovable-channels-container.mobile-show {
          opacity: 1;
          transform: translateY(0) scale(1);
          visibility: visible;
          pointer-events: auto;
        }
      }
    `,
    js: `
      // Elegant Template - HOVER behavior (desktop) and CLICK (mobile)
      const elegantWidget = document.getElementById('lovable-widget-elegant');
      const elegantMainBtn = document.getElementById('lovable-main-btn');
      const elegantChannelsContainer = document.getElementById('lovable-channels');
      const elegantTooltip = document.getElementById('lovable-tooltip');
      let isMobile = window.innerWidth <= 768;
      let isOpen = false;
      
      // Initialize elements
      if (!elegantWidget || !elegantMainBtn || !elegantChannelsContainer) {
        console.error('Elegant widget elements not found:', {
          widget: !!elegantWidget,
          button: !!elegantMainBtn,
          container: !!elegantChannelsContainer
        });
      } else {
        console.log('Elegant widget elements found');
      }
      
      // Generate channels HTML
      function generateChannelsHtml() {
        const channelsData = {{CHANNELS_DATA}};
        if (!channelsData || channelsData.length === 0) return '';
        
        let html = '';
        
        channelsData.forEach(channel => {
          const channelUrl = getChannelUrl(channel);
          const channelIcon = getChannelIcon(channel);
          const channelColor = getChannelColor(channel.type);
          
          if (channel.childChannels && channel.childChannels.length > 0) {
            // Create a group with dropdown
            const groupId = 'elegant-group-' + channel.id;
            
            html += '<div class="lovable-channel-group">';
            html += '<div class="lovable-group-trigger" onclick="toggleElegantGroup(\\'' + groupId + '\\')">';
            html += '<div class="lovable-channel-icon" style="color: ' + channelColor + ';">' + channelIcon + '</div>';
            html += '<div class="lovable-channel-info">';
            html += '<div class="lovable-channel-label">' + escapeHtml(channel.label) + '</div>';
            html += '<div class="lovable-channel-value">' + (channel.childChannels.length + 1) + ' options</div>';
            html += '</div>';
            html += '<span class="lovable-group-count">' + (channel.childChannels.length + 1) + '</span>';
            html += '</div>';
            
            html += '<div class="lovable-group-dropdown" id="' + groupId + '">';
            
            // Add parent channel as first item
            html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="lovable-group-item" onclick="openChannel(\\'' + escapeHtml(channelUrl) + '\\'); return false;">';
            html += '<div class="lovable-channel-icon" style="color: ' + channelColor + ';">' + channelIcon + '</div>';
            html += '<div class="lovable-channel-info">';
            html += '<div class="lovable-channel-label">' + escapeHtml(channel.label) + ' (Primary)</div>';
            html += '<div class="lovable-channel-value">' + escapeHtml(channel.value) + '</div>';
            html += '</div>';
            html += '</a>';
            
            // Add child channels
            channel.childChannels.forEach(childChannel => {
              const childUrl = getChannelUrl(childChannel);
              const childIcon = getChannelIcon(childChannel);
              const childColor = getChannelColor(childChannel.type);
              
              html += '<a href="' + escapeHtml(childUrl) + '" target="_blank" class="lovable-group-item" onclick="openChannel(\\'' + escapeHtml(childUrl) + '\\'); return false;">';
              html += '<div class="lovable-channel-icon" style="color: ' + childColor + ';">' + childIcon + '</div>';
              html += '<div class="lovable-channel-info">';
              html += '<div class="lovable-channel-label">' + escapeHtml(childChannel.label) + '</div>';
              html += '<div class="lovable-channel-value">' + escapeHtml(childChannel.value) + '</div>';
              html += '</div>';
              html += '</a>';
            });
            
            html += '</div>'; // End dropdown
            html += '</div>'; // End channel group
          } else {
            // Regular channel without children
            html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="lovable-channel-button" onclick="openChannel(\\'' + escapeHtml(channelUrl) + '\\'); return false;">';
            html += '<div class="lovable-channel-icon" style="color: ' + channelColor + ';">' + channelIcon + '</div>';
            html += '<div class="lovable-channel-info">';
            html += '<div class="lovable-channel-label">' + escapeHtml(channel.label) + '</div>';
            html += '<div class="lovable-channel-value">' + escapeHtml(channel.value) + '</div>';
            html += '</div>';
            html += '</a>';
          }
        });
        
        return html;
      }
      
      function getChannelUrl(channel) {
        switch (channel.type) {
          case 'whatsapp': return 'https://wa.me/' + channel.value.replace(/\\D/g, '');
          case 'telegram': return 'https://t.me/' + channel.value.replace('@', '');
          case 'email': return 'mailto:' + channel.value;
          case 'phone': return 'tel:' + channel.value;
          default: return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
        }
      }
      
      function getChannelIcon(channel) {
        const icons = {
          whatsapp: '📱',
          telegram: '✈️',
          instagram: '📷',
          messenger: '💬',
          viber: '📞',
          skype: '💻',
          discord: '🎮',
          tiktok: '🎵',
          youtube: '📺',
          facebook: '👥',
          twitter: '🐦',
          linkedin: '💼',
          github: '⚡',
          website: '🌐',
          chatbot: '🤖',
          email: '✉️',
          phone: '📞',
          custom: '🔗'
        };
        return icons[channel.type] || '🔗';
      }
      
      function getChannelColor(type) {
        const colors = {
          whatsapp: '#25d366',
          telegram: '#0088cc',
          instagram: '#e4405f',
          messenger: '#006aff',
          viber: '#665cac',
          skype: '#00aff0',
          discord: '#7289da',
          tiktok: '#000000',
          youtube: '#ff0000',
          facebook: '#1877f2',
          twitter: '#1da1f2',
          linkedin: '#0077b5',
          github: '#333333',
          website: '#6b7280',
          chatbot: '#3b82f6',
          email: '#ea4335',
          phone: '#34d399',
          custom: '#6b7280'
        };
        return colors[type] || '#6b7280';
      }
      
      function escapeHtml(text) {
        if (!text) return '';
        return String(text)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }
      
      // Render channels
      if (elegantChannelsContainer) {
        elegantChannelsContainer.querySelector('.lovable-channels-list').innerHTML = generateChannelsHtml();
      }
      
      // Handle mobile clicks (different behavior for mobile)
      if (elegantMainBtn && elegantChannelsContainer) {
        elegantMainBtn.addEventListener('click', function(e) {
          if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            
            isOpen = !isOpen;
            
            if (isOpen) {
              elegantChannelsContainer.classList.add('mobile-show');
              console.log('Elegant widget opened on mobile');
            } else {
              elegantChannelsContainer.classList.remove('mobile-show');
              console.log('Elegant widget closed on mobile');
            }
          }
        });
      }
      
      // Close when clicking outside (mobile only)
      document.addEventListener('click', function(e) {
        if (isMobile && elegantWidget && !elegantWidget.contains(e.target)) {
          if (isOpen) {
            elegantChannelsContainer.classList.remove('mobile-show');
            isOpen = false;
            console.log('Elegant widget closed by outside click');
          }
        }
      });
      
      // Tooltip functionality
      if (elegantTooltip && elegantMainBtn) {
        if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
          elegantMainBtn.addEventListener('mouseenter', function() {
            elegantTooltip.classList.add('show');
            elegantTooltip.style.display = 'block';
          });
          
          elegantMainBtn.addEventListener('mouseleave', function() {
            elegantTooltip.classList.remove('show');
            setTimeout(function() {
              if (!elegantTooltip.classList.contains('show')) {
                elegantTooltip.style.display = 'none';
              }
            }, 300);
          });
        } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
          elegantTooltip.style.display = 'block';
          elegantTooltip.classList.add('show');
        }
      }
      
      // Update mobile status on resize
      window.addEventListener('resize', function() {
        isMobile = window.innerWidth <= 768;
        if (!isMobile && isOpen) {
          elegantChannelsContainer.classList.remove('mobile-show');
          isOpen = false;
        }
      });
      
      // Global channel click function
      window.openChannel = function(url) {
        window.open(url, '_blank');
        console.log('Channel opened:', url);
      };
      
      // Global group toggle function
      window.toggleElegantGroup = function(groupId) {
        const dropdown = document.getElementById(groupId);
        if (dropdown) {
          dropdown.classList.toggle('show');
          console.log('Toggled group:', groupId);
        }
      };
      
      console.log('Elegant widget loaded with HOVER behavior (desktop) and CLICK (mobile)');
    `
  }
}