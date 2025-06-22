
import type { WidgetTemplate } from '../template-types.ts'

export function getElegantTemplate(): WidgetTemplate {
  return {
    id: 'elegant',
    name: 'Elegant Design',
    description: 'Modern elegant design with smooth animations and perfect functionality',
    html: `
      <div id="lovable-widget-elegant" class="lovable-widget-elegant">
        <!-- Main Button -->
        <div class="lovable-main-button" id="lovable-main-btn">
          {{BUTTON_ICON}}
        </div>
        
        <!-- Tooltip -->
        <div class="lovable-tooltip" id="lovable-tooltip" style="display: {{TOOLTIP_DISPLAY}};">
          {{TOOLTIP_TEXT}}
        </div>
        
        <!-- Channels Container -->
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
      }
      
      .lovable-channels-container.show {
        opacity: 1;
        transform: translateY(0) scale(1);
        visibility: visible;
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
      }
      
      .lovable-channel-button:hover {
        background: #f9fafb;
        border-color: {{BUTTON_COLOR}};
        transform: translateY(-1px);
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
      
      .lovable-channel-group {
        position: relative;
      }
      
      .lovable-channel-group-trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        font-weight: 500;
        color: #374151;
        transition: all 0.2s ease;
      }
      
      .lovable-channel-group-trigger:hover {
        background: #f9fafb;
        border-color: {{BUTTON_COLOR}};
        transform: translateY(-1px);
      }
      
      .lovable-channel-group-items {
        position: absolute;
        left: 100%;
        top: 0;
        margin-left: 8px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        padding: 8px;
        min-width: 200px;
        opacity: 0;
        transform: translateX(-10px);
        visibility: hidden;
        transition: all 0.2s ease;
        z-index: 1000001;
      }
      
      .lovable-channel-group:hover .lovable-channel-group-items {
        opacity: 1;
        transform: translateX(0);
        visibility: visible;
      }
      
      .lovable-channel-group-items .lovable-channel-button {
        margin: 0;
        border-radius: 8px;
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
        
        .lovable-channel-group-items {
          position: static;
          margin-left: 0;
          margin-top: 8px;
          transform: none;
          visibility: visible;
          opacity: 1;
          display: none;
        }
        
        .lovable-channel-group.active .lovable-channel-group-items {
          display: block;
        }
      }
    `,
    js: `
      // Widget functionality
      const widget = document.getElementById('lovable-widget-elegant');
      const mainBtn = document.getElementById('lovable-main-btn');
      const channelsContainer = document.getElementById('lovable-channels');
      const tooltip = document.getElementById('lovable-tooltip');
      let isOpen = false;
      
      // Main button click handler
      if (mainBtn && channelsContainer) {
        mainBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          isOpen = !isOpen;
          
          if (isOpen) {
            channelsContainer.classList.add('show');
            console.log('Elegant widget opened');
          } else {
            channelsContainer.classList.remove('show');
            console.log('Elegant widget closed');
          }
        });
      }
      
      // Close when clicking outside
      document.addEventListener('click', function(e) {
        if (widget && !widget.contains(e.target)) {
          if (isOpen) {
            channelsContainer.classList.remove('show');
            isOpen = false;
            console.log('Elegant widget closed by outside click');
          }
        }
      });
      
      // Tooltip functionality
      if (tooltip && mainBtn) {
        if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
          mainBtn.addEventListener('mouseenter', function() {
            tooltip.classList.add('show');
          });
          
          mainBtn.addEventListener('mouseleave', function() {
            tooltip.classList.remove('show');
          });
        } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
          tooltip.style.display = 'block';
          tooltip.classList.add('show');
        }
      }
      
      // Channel group functionality for mobile
      const channelGroups = document.querySelectorAll('.lovable-channel-group-trigger');
      channelGroups.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const group = this.closest('.lovable-channel-group');
            group.classList.toggle('active');
          }
        });
      });
      
      // Global channel click function
      window.openChannel = function(url) {
        window.open(url, '_blank');
        console.log('Channel opened:', url);
      };
      
      console.log('Elegant widget loaded successfully');
    `
  }
}
