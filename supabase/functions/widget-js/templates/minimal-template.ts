import type { WidgetTemplate } from '../template-types.ts'

export const minimalTemplate: WidgetTemplate = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Clean and simple design with animations',
  html: `
    <div id="widget-container" class="widget-container position-{{POSITION}}">
      <div id="widget-channels-list" class="widget-channels-list">
        <!-- Channels will be dynamically generated -->
      </div>
      <button id="widget-main-button" class="widget-main-button" style="background: {{BUTTON_COLOR}}; --button-size: {{BUTTON_SIZE}}px;">
        {{BUTTON_ICON}}
      </button>
      <div id="widget-tooltip" class="widget-tooltip position-{{TOOLTIP_POSITION}} {{TOOLTIP_DISPLAY}}">
        {{TOOLTIP_TEXT}}
      </div>
      {{VIDEO_CONTENT}}
    </div>
  `,
  css: `
    .widget-container {
      position: fixed;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    }

    .widget-container.position-right {
      right: 20px;
      bottom: 20px;
    }

    .widget-container.position-left {
      left: 20px;
      bottom: 20px;
    }

    .widget-main-button {
      width: var(--button-size, 60px);
      height: var(--button-size, 60px);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 10001;
    }

    .widget-main-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }

    .widget-main-button.active {
      transform: rotate(45deg);
      background: #ff4444 !important;
    }

    .widget-channels-list {
      position: absolute;
      bottom: 80px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10000;
      align-items: center;
    }

    .widget-channels-list.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .widget-channel-btn {
      width: var(--button-size, 60px);
      height: var(--button-size, 60px);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      transform: scale(0) translateY(20px);
      opacity: 0;
    }

    .widget-channels-list.show .widget-channel-btn {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    .widget-channels-list.show .widget-channel-btn:nth-child(1) {
      transition-delay: 0.1s;
    }

    .widget-channels-list.show .widget-channel-btn:nth-child(2) {
      transition-delay: 0.2s;
    }

    .widget-channels-list.show .widget-channel-btn:nth-child(3) {
      transition-delay: 0.3s;
    }

    .widget-channels-list.show .widget-channel-btn:nth-child(4) {
      transition-delay: 0.4s;
    }

    .widget-channels-list.show .widget-channel-btn:nth-child(5) {
      transition-delay: 0.5s;
    }

    .widget-channels-list.show .widget-channel-btn:nth-child(6) {
      transition-delay: 0.6s;
    }

    .widget-channel-btn:hover {
      transform: translateY(-3px) scale(1.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }

    /* Platform colors */
    .widget-channel-btn[data-type="whatsapp"] { background: #25d366; }
    .widget-channel-btn[data-type="telegram"] { background: #0088cc; }
    .widget-channel-btn[data-type="instagram"] { background: #e4405f; }
    .widget-channel-btn[data-type="messenger"] { background: #006aff; }
    .widget-channel-btn[data-type="viber"] { background: #665cac; }
    .widget-channel-btn[data-type="skype"] { background: #00aff0; }
    .widget-channel-btn[data-type="discord"] { background: #7289da; }
    .widget-channel-btn[data-type="tiktok"] { background: #000000; }
    .widget-channel-btn[data-type="youtube"] { background: #ff0000; }
    .widget-channel-btn[data-type="facebook"] { background: #1877f2; }
    .widget-channel-btn[data-type="twitter"] { background: #1da1f2; }
    .widget-channel-btn[data-type="linkedin"] { background: #0077b5; }
    .widget-channel-btn[data-type="github"] { background: #333333; }
    .widget-channel-btn[data-type="website"] { background: #6b7280; }
    .widget-channel-btn[data-type="chatbot"] { background: #3b82f6; }
    .widget-channel-btn[data-type="email"] { background: #ea4335; }
    .widget-channel-btn[data-type="phone"] { background: #34d399; }
    .widget-channel-btn[data-type="custom"] { background: #6b7280; }

    /* Channel groups for multiple same-type channels */
    .widget-channel-group {
      position: relative;
    }

    .widget-dropdown-btn {
      position: relative;
    }

    .widget-dropdown-btn .child-indicator {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ff4444;
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }

    .widget-dropdown {
      position: absolute;
      left: calc(100% + 15px);
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      min-width: 220px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 10002;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-50%) translateX(-10px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .widget-container.position-left .widget-dropdown {
      left: auto;
      right: calc(100% + 15px);
      transform: translateY(-50%) translateX(10px) scale(0.95);
    }

    .widget-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0) scale(1);
    }

    .widget-container.position-left .widget-dropdown.show {
      transform: translateY(-50%) translateX(0) scale(1);
    }

    .widget-dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      text-decoration: none;
      color: #374151;
      transition: all 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .widget-dropdown-item:hover {
      background: #f8fafc;
    }

    .widget-dropdown-item:first-child {
      border-radius: 12px 12px 0 0;
    }

    .widget-dropdown-item:last-child {
      border-radius: 0 0 12px 12px;
    }

    .widget-dropdown-item:only-child {
      border-radius: 12px;
    }

    .widget-dropdown-item + .widget-dropdown-item {
      border-top: 1px solid #f1f5f9;
    }

    .widget-dropdown-item i {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .widget-dropdown-item .item-info {
      flex: 1;
    }

    .widget-dropdown-item .item-label {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 2px;
    }

    .widget-dropdown-item .item-value {
      color: #64748b;
      font-size: 12px;
    }

    .widget-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 10003;
      backdrop-filter: blur(10px);
    }

    .widget-tooltip.show, .widget-tooltip.always {
      opacity: 1;
    }

    .widget-tooltip.position-top {
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
    }

    .widget-tooltip.position-bottom {
      top: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
    }

    .widget-tooltip.position-left {
      right: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
    }

    .widget-tooltip.position-right {
      left: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
    }

    .widget-video {
      position: absolute;
      bottom: calc(100% + 15px);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      background: white;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;
      z-index: 10000;
    }

    .widget-video.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .widget-container.position-right .widget-video {
      right: 0;
    }

    .widget-container.position-left .widget-video {
      left: 0;
    }

    .widget-video.center {
      left: 50%;
      transform: translateX(-50%) translateY(10px);
    }

    .widget-video.center.show {
      transform: translateX(-50%) translateY(0);
    }

    .widget-video video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }

    @media (max-width: 768px) {
      .widget-container {
        right: 15px !important;
        left: 15px !important;
        bottom: 15px !important;
      }
      
      .widget-dropdown {
        min-width: 200px;
        left: auto !important;
        right: calc(100% + 10px) !important;
        margin: 0 !important;
      }

      .widget-container.position-left .widget-dropdown {
        right: auto !important;
        left: calc(100% + 10px) !important;
      }
    }

    /* FontAwesome icon styles */
    .widget-channel-btn i,
    .widget-dropdown-item i {
      font-family: "Font Awesome 6 Brands", "Font Awesome 6 Free";
      font-weight: 900;
    }
  `,
  js: `
    (function() {
      console.log('Minimal widget JavaScript loading...');
      
      let isMenuOpen = false;
      let activeDropdown = null;
      
      function initWidget() {
        console.log('Initializing minimal widget...');
        
        const button = document.getElementById('widget-main-button');
        const channelsList = document.getElementById('widget-channels-list');
        const tooltip = document.getElementById('widget-tooltip');
        const video = document.querySelector('.widget-video');
        
        if (!button) {
          console.error('Widget button not found');
          return;
        }

        // Generate channels HTML
        generateChannelsHtml();

        // Button click handler
        button.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Widget button clicked, current state:', isMenuOpen);
          toggleMenu();
        });

        // Tooltip functionality
        if (tooltip) {
          const tooltipDisplay = '{{TOOLTIP_DISPLAY}}';
          
          if (tooltipDisplay === 'hover') {
            button.addEventListener('mouseenter', function() {
              if (!isMenuOpen) {
                tooltip.classList.add('show');
              }
            });
            
            button.addEventListener('mouseleave', function() {
              tooltip.classList.remove('show');
            });
          } else if (tooltipDisplay === 'always') {
            tooltip.classList.add('always');
          }
        }

        // Video hover functionality
        if (video) {
          button.addEventListener('mouseenter', function() {
            if (!isMenuOpen) {
              video.classList.add('show');
            }
          });
          
          button.addEventListener('mouseleave', function() {
            video.classList.remove('show');
          });
        }

        // Initialize channel dropdowns
        initChannelDropdowns();

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
          if (!e.target.closest('#widget-container')) {
            closeMenu();
            closeAllDropdowns();
          }
        });
        
        console.log('Minimal widget initialized successfully');
      }

      function generateChannelsHtml() {
        const channelsList = document.getElementById('widget-channels-list');
        if (!channelsList) return;
        
        const channelsData = {{CHANNELS_DATA}};
        if (!channelsData || !channelsData.length) return;
        
        let html = '';
        
        channelsData.forEach(channel => {
          const channelUrl = getChannelUrl(channel);
          
          if (channel.childChannels && channel.childChannels.length > 0) {
            // Group with dropdown
            const dropdownId = 'dropdown-' + channel.id;
            const childCount = channel.childChannels.length;
            
            html += '<div class="widget-channel-group">';
            html += '<a href="' + channelUrl + '" class="widget-channel-btn widget-dropdown-btn" data-dropdown="' + dropdownId + '" data-type="' + channel.type + '" onclick="window.openChannel && window.openChannel(\\'' + channelUrl + '\\'); return false;">';
            
            if (channel.type === 'custom' && channel.customIcon) {
              html += '<img src="' + channel.customIcon + '" style="width: 20px; height: 20px; object-fit: contain;" alt="Custom icon">';
            } else {
              html += getChannelIcon(channel.type);
            }
            
            html += '<span class="child-indicator">+' + childCount + '</span>';
            html += '</a>';
            
            html += '<div class="widget-dropdown" id="' + dropdownId + '">';
            
            // Add parent as first item
            html += '<a href="' + channelUrl + '" class="widget-dropdown-item" onclick="window.openChannel && window.openChannel(\\'' + channelUrl + '\\'); return false;">';
            html += '<i>' + getChannelIcon(channel.type) + '</i>';
            html += '<div class="item-info">';
            html += '<div class="item-label">' + channel.label + '</div>';
            html += '<div class="item-value">' + channel.value + '</div>';
            html += '</div>';
            html += '</a>';
            
            // Add child channels
            channel.childChannels.forEach(childChannel => {
              const childUrl = getChannelUrl(childChannel);
              
              html += '<a href="' + childUrl + '" class="widget-dropdown-item" onclick="window.openChannel && window.openChannel(\\'' + childUrl + '\\'); return false;">';
              html += '<i>' + getChannelIcon(childChannel.type) + '</i>';
              html += '<div class="item-info">';
              html += '<div class="item-label">' + childChannel.label + '</div>';
              html += '<div class="item-value">' + childChannel.value + '</div>';
              html += '</div>';
              html += '</a>';
            });
            
            html += '</div>';
            html += '</div>';
          } else {
            // Regular channel
            html += '<a href="' + channelUrl + '" class="widget-channel-btn" data-type="' + channel.type + '" onclick="window.openChannel && window.openChannel(\\'' + channelUrl + '\\'); return false;">';
            
            if (channel.type === 'custom' && channel.customIcon) {
              html += '<img src="' + channel.customIcon + '" style="width: 20px; height: 20px; object-fit: contain;" alt="Custom icon">';
            } else {
              html += getChannelIcon(channel.type);
            }
            
            html += '</a>';
          }
        });
        
        channelsList.innerHTML = html;
      }

      function initChannelDropdowns() {
        const dropdownBtns = document.querySelectorAll('.widget-dropdown-btn');
        
        dropdownBtns.forEach(function(btn) {
          btn.addEventListener('mouseenter', function() {
            if (!isMenuOpen) return;
            
            const dropdownId = this.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId);
            
            if (dropdown) {
              closeAllDropdowns();
              const self = this;
              setTimeout(function() {
                if (self.matches(':hover')) {
                  dropdown.classList.add('show');
                  activeDropdown = dropdown;
                }
              }, 100);
            }
          });
          
          btn.addEventListener('mouseleave', function() {
            const dropdownId = this.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId);
            const self = this;
            setTimeout(function() {
              if (dropdown && !dropdown.matches(':hover') && !self.matches(':hover')) {
                dropdown.classList.remove('show');
                if (activeDropdown === dropdown) {
                  activeDropdown = null;
                }
              }
            }, 300);
          });
        });
        
        const dropdowns = document.querySelectorAll('.widget-dropdown');
        dropdowns.forEach(function(dropdown) {
          dropdown.addEventListener('mouseleave', function() {
            const self = this;
            setTimeout(function() {
              if (!self.matches(':hover')) {
                self.classList.remove('show');
                if (activeDropdown === self) {
                  activeDropdown = null;
                }
              }
            }, 300);
          });
        });
      }

      function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.widget-dropdown');
        dropdowns.forEach(function(dropdown) {
          dropdown.classList.remove('show');
        });
        activeDropdown = null;
      }

      function toggleMenu() {
        const button = document.getElementById('widget-main-button');
        const channelsList = document.getElementById('widget-channels-list');
        const tooltip = document.getElementById('widget-tooltip');
        const video = document.querySelector('.widget-video');
        
        if (!channelsList) {
          console.error('Channels list not found');
          return;
        }
        
        isMenuOpen = !isMenuOpen;
        console.log('Toggling menu, new state:', isMenuOpen);
        
        if (isMenuOpen) {
          channelsList.classList.add('show');
          button.classList.add('active');
          if (tooltip) tooltip.classList.remove('show');
          if (video) video.classList.remove('show');
        } else {
          channelsList.classList.remove('show');
          button.classList.remove('active');
          closeAllDropdowns();
        }
      }

      function closeMenu() {
        const button = document.getElementById('widget-main-button');
        const channelsList = document.getElementById('widget-channels-list');
        if (channelsList && button) {
          channelsList.classList.remove('show');
          button.classList.remove('active');
          isMenuOpen = false;
        }
      }

      // Utility functions
      function getChannelUrl(channel) {
        switch (channel.type) {
          case 'whatsapp':
            return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
          case 'telegram':
            return channel.value.startsWith('@') ? 'https://t.me/' + channel.value.slice(1) : 'https://t.me/' + channel.value;
          case 'email':
            return 'mailto:' + channel.value;
          case 'phone':
            return 'tel:' + channel.value;
          default:
            return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
        }
      }
      
      function getChannelIcon(type) {
        const icons = {
          whatsapp: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/></svg>',
          telegram: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
          email: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
          phone: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
          instagram: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
          facebook: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
          website: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'
        };
        return icons[type] || '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v8a2 2 0 002 2h4v-2H6V8h4V6zM14 6v2h4v8h-4v2h4a2 2 0 002-2V8a2 2 0 00-2-2h-4zM12 11h-2v2h2v-2z"/></svg>';
      }

      // Global channel opener
      window.openChannel = function(url) {
        console.log('Opening channel:', url);
        window.open(url, '_blank');
      };

      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
      } else {
        initWidget();
      }
    })();
  `
};

export function getMinimalTemplate(): WidgetTemplate {
  return minimalTemplate;
}