import type { WidgetTemplate } from '../template-types.ts'

export const minimalTemplate: WidgetTemplate = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Clean and simple design with animations',
  html: `
    <div class="widget-container position-{{POSITION}}">
      <div class="widget-channels-list">
        {{CHANNELS_HTML}}
      </div>
      <button class="widget-main-button" style="background: {{BUTTON_COLOR}}; --button-size: {{BUTTON_SIZE}}px;">
        {{BUTTON_ICON}}
      </button>
      <div class="widget-tooltip position-{{TOOLTIP_POSITION}} {{TOOLTIP_DISPLAY}}">
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
      gap: 15px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10000;
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
      transform: scale(0);
      opacity: 0;
    }

    .widget-channels-list.show .widget-channel-btn {
      transform: scale(1);
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
      let isMenuOpen = false;
      let activeDropdown = null;
      
      function initWidget() {
        console.log('Initializing minimal widget...');
        
        const button = document.querySelector('.widget-main-button');
        const channelsList = document.querySelector('.widget-channels-list');
        const tooltip = document.querySelector('.widget-tooltip');
        const video = document.querySelector('.widget-video');
        
        if (!button) {
          console.error('Widget button not found');
          return;
        }

        // Button click handler - Fixed the event listener
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
          if (!e.target.closest('.widget-container')) {
            closeMenu();
            closeAllDropdowns();
          }
        });
        
        console.log('Minimal widget initialized successfully');
      }

      function initChannelDropdowns() {
        const dropdownBtns = document.querySelectorAll('.widget-dropdown-btn');
        
        dropdownBtns.forEach(function(btn) {
          // Hover functionality for dropdowns
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
        
        // Keep dropdown open when hovering over it
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
        const button = document.querySelector('.widget-main-button');
        const channelsList = document.querySelector('.widget-channels-list');
        const tooltip = document.querySelector('.widget-tooltip');
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
        const button = document.querySelector('.widget-main-button');
        const channelsList = document.querySelector('.widget-channels-list');
        if (channelsList && button) {
          channelsList.classList.remove('show');
          button.classList.remove('active');
          isMenuOpen = false;
        }
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
