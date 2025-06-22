
import type { WidgetTemplate } from '../template-types.ts'

export const minimalTemplate: WidgetTemplate = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Clean and simple design',
  html: `
    <div class="widget-container position-right">
      <button class="widget-button">
        <i class="widget-icon"></i>
      </button>
      <div class="widget-tooltip position-top">
        Contact us!
      </div>
      <div class="widget-menu">
        <div class="widget-channel-buttons">
          <!-- Channel buttons will be dynamically inserted here -->
        </div>
      </div>
      <div class="widget-video">
        <video autoplay loop muted playsinline>
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
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

    .widget-button {
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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
    }

    .widget-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .widget-tooltip {
      position: absolute;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 10000;
    }

    .widget-tooltip.show {
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

    .widget-menu {
      position: absolute;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;
      z-index: 10001;
      border: 1px solid #e5e7eb;
    }

    .widget-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .widget-container.position-right .widget-menu {
      right: 0;
      bottom: calc(100% + 15px);
    }

    .widget-container.position-left .widget-menu {
      left: 0;
      bottom: calc(100% + 15px);
    }

    .widget-channel-btn {
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
      cursor: pointer;
      position: relative;
    }

    .widget-channel-btn:hover {
      background: #f3f4f6;
    }

    .widget-channel-btn:first-child {
      border-radius: 12px 12px 0 0;
    }

    .widget-channel-btn:last-child {
      border-radius: 0 0 12px 12px;
    }

    .widget-channel-btn:only-child {
      border-radius: 12px;
    }

    .widget-channel-btn + .widget-channel-btn {
      border-top: 1px solid #e5e7eb;
    }

    .widget-channel-btn i {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .widget-channel-btn span {
      font-weight: 500;
      font-size: 14px;
      flex: 1;
    }

    /* New styles for channel groups and dropdowns */
    .widget-channel-group {
      position: relative;
    }

    .widget-dropdown-btn {
      position: relative;
    }

    .widget-dropdown-btn .child-count {
      background: #3b82f6;
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: auto;
      margin-right: 8px;
    }

    .widget-dropdown-btn .dropdown-arrow {
      font-size: 10px;
      color: #6b7280;
      transition: transform 0.2s ease;
    }

    .widget-dropdown-btn.active .dropdown-arrow {
      transform: rotate(180deg);
    }

    .widget-dropdown {
      position: absolute;
      right: 100%;
      top: 0;
      margin-right: 8px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 250px;
      border: 1px solid #e5e7eb;
      z-index: 10002;
    }

    .widget-container.position-left .widget-dropdown {
      right: auto;
      left: 100%;
      margin-right: 0;
      margin-left: 8px;
    }

    .widget-dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      text-decoration: none;
      color: #374151;
      transition: background 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .widget-dropdown-item:hover {
      background: #f3f4f6;
    }

    .widget-dropdown-item:first-child {
      border-radius: 8px 8px 0 0;
    }

    .widget-dropdown-item:last-child {
      border-radius: 0 0 8px 8px;
    }

    .widget-dropdown-item:only-child {
      border-radius: 8px;
    }

    .widget-dropdown-item + .widget-dropdown-item {
      border-top: 1px solid #e5e7eb;
    }

    .widget-dropdown-item i {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .widget-dropdown-item span {
      font-size: 13px;
    }

    .widget-dropdown-item .dropdown-value {
      color: #6b7280;
      font-size: 11px;
      margin-left: auto;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Video styles - keep existing code */
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
      
      .widget-menu {
        min-width: 180px;
      }
      
      .widget-dropdown {
        min-width: 200px;
        right: 0 !important;
        left: auto !important;
        margin: 0 !important;
        top: 100% !important;
        margin-top: 8px !important;
      }
    }
  `,
  js: `
    (function() {
      let isMenuOpen = false;
      let activeDropdown = null;
      
      function initWidget() {
        const button = document.querySelector('.widget-button');
        const menu = document.querySelector('.widget-menu');
        const tooltip = document.querySelector('.widget-tooltip');
        const video = document.querySelector('.widget-video');
        
        if (!button) return;

        // Button click handler
        button.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleMenu();
        });

        // Tooltip functionality
        if (tooltip) {
          const tooltipDisplay = '{{TOOLTIP_DISPLAY}}';
          
          if (tooltipDisplay === 'hover') {
            button.addEventListener('mouseenter', () => {
              if (!isMenuOpen) {
                tooltip.classList.add('show');
              }
            });
            
            button.addEventListener('mouseleave', () => {
              tooltip.classList.remove('show');
            });
          } else if (tooltipDisplay === 'always') {
            tooltip.classList.add('show');
          }
        }

        // Video hover functionality
        if (video) {
          button.addEventListener('mouseenter', () => {
            if (!isMenuOpen) {
              video.classList.add('show');
            }
          });
          
          button.addEventListener('mouseleave', () => {
            video.classList.remove('show');
          });
          
          menu?.addEventListener('mouseenter', () => {
            video.classList.remove('show');
          });
        }

        // Dropdown functionality for channel groups
        initChannelDropdowns();

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
          if (!e.target.closest('.widget-container')) {
            closeMenu();
            closeAllDropdowns();
          }
        });
      }

      function initChannelDropdowns() {
        const dropdownBtns = document.querySelectorAll('.widget-dropdown-btn');
        
        dropdownBtns.forEach(btn => {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdownId = this.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId);
            
            if (activeDropdown && activeDropdown !== dropdown) {
              closeAllDropdowns();
            }
            
            if (dropdown) {
              if (dropdown.style.display === 'none' || !dropdown.style.display) {
                dropdown.style.display = 'block';
                this.classList.add('active');
                activeDropdown = dropdown;
              } else {
                closeDropdown(dropdown, this);
              }
            }
          });
          
          // Hover functionality for dropdowns
          btn.addEventListener('mouseenter', function() {
            const dropdownId = this.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId);
            
            if (dropdown && !dropdown.style.display) {
              setTimeout(() => {
                if (this.matches(':hover')) {
                  closeAllDropdowns();
                  dropdown.style.display = 'block';
                  this.classList.add('active');
                  activeDropdown = dropdown;
                }
              }, 200);
            }
          });
        });
        
        // Close dropdown when mouse leaves the group
        const channelGroups = document.querySelectorAll('.widget-channel-group');
        channelGroups.forEach(group => {
          group.addEventListener('mouseleave', function() {
            setTimeout(() => {
              if (!group.matches(':hover')) {
                const dropdown = group.querySelector('.widget-dropdown');
                const btn = group.querySelector('.widget-dropdown-btn');
                if (dropdown && btn) {
                  closeDropdown(dropdown, btn);
                }
              }
            }, 300);
          });
        });
      }

      function closeDropdown(dropdown, btn) {
        dropdown.style.display = 'none';
        btn.classList.remove('active');
        if (activeDropdown === dropdown) {
          activeDropdown = null;
        }
      }

      function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.widget-dropdown');
        const dropdownBtns = document.querySelectorAll('.widget-dropdown-btn');
        
        dropdowns.forEach(dropdown => {
          dropdown.style.display = 'none';
        });
        
        dropdownBtns.forEach(btn => {
          btn.classList.remove('active');
        });
        
        activeDropdown = null;
      }

      function toggleMenu() {
        const menu = document.querySelector('.widget-menu');
        const tooltip = document.querySelector('.widget-tooltip');
        const video = document.querySelector('.widget-video');
        
        if (!menu) return;
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
          menu.classList.add('show');
          tooltip?.classList.remove('show');
          video?.classList.remove('show');
        } else {
          menu.classList.remove('show');
          closeAllDropdowns();
        }
      }

      function closeMenu() {
        const menu = document.querySelector('.widget-menu');
        if (menu) {
          menu.classList.remove('show');
          isMenuOpen = false;
        }
      }

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
