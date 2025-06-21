
import type { WidgetTemplate } from './template-registry.ts'

export const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Default Template', 
  description: 'Clean and modern floating widget',
  html: `
    <div id="lovable-widget-container" style="position: fixed; z-index: 999999; bottom: 20px; {{POSITION_STYLE}}">
      <div id="lovable-widget-tooltip" style="display: none; position: absolute; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-size: 14px; white-space: nowrap; z-index: 1000000; {{TOOLTIP_POSITION_STYLE}}">
        {{TOOLTIP_TEXT}}
      </div>
      <button id="lovable-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; border-radius: 50%; border: none; background: {{BUTTON_COLOR}}; color: white; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 24px; transition: all 0.3s ease; position: relative;">
        {{BUTTON_ICON}}
      </button>

      <div id="lovable-widget-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000001; backdrop-filter: blur(4px);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 16px; padding: 0; max-width: 400px; width: 90%; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
          <div style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #f0f0f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">{{GREETING_MESSAGE}}</h3>
              <button id="lovable-widget-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;">×</button>
            </div>
            {{VIDEO_CONTENT}}
          </div>
          <div style="padding: 16px 24px 24px 24px;">
            <div id="lovable-widget-channels" style="display: flex; flex-direction: column; gap: 12px;">
              {{CHANNELS_HTML}}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  css: `
    #lovable-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    }
    
    #lovable-widget-close:hover {
      background: #f5f5f5;
    }
    
    .lovable-channel-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      text-decoration: none;
      color: #334155;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .lovable-channel-button:hover {
      border-color: {{BUTTON_COLOR}};
      background: {{BUTTON_COLOR}}10;
      transform: translateY(-1px);
    }
    
    .lovable-channel-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  
  js: `
    console.log('Initializing Lovable Widget with config:', {
      channels: {{CHANNELS_COUNT}},
      buttonColor: '{{BUTTON_COLOR}}',
      position: '{{POSITION}}',
      tooltip: '{{TOOLTIP_TEXT}}',
      greetingMessage: '{{GREETING_MESSAGE}}'
    });

    const widget = {
      container: null,
      button: null,
      modal: null,
      tooltip: null,
      videoElement: null,
      
      init() {
        this.container = document.getElementById('lovable-widget-container');
        this.button = document.getElementById('lovable-widget-button');
        this.modal = document.getElementById('lovable-widget-modal');
        this.tooltip = document.getElementById('lovable-widget-tooltip');
        this.videoElement = document.querySelector('#lovable-widget-modal video');
        
        if (!this.container || !this.button || !this.modal) {
          console.error('Widget elements not found');
          return;
        }
        
        this.setupEventListeners();
        console.log('Widget initialized successfully');
      },
      
      setupEventListeners() {
        // Button click
        this.button.addEventListener('click', () => {
          console.log('Widget button clicked, showing modal');
          this.showModal();
        });
        
        // Close button
        const closeBtn = document.getElementById('lovable-widget-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            this.hideModal();
          });
        }
        
        // Modal backdrop
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) {
            console.log('Backdrop clicked, closing modal');
            this.hideModal();
          }
        });
        
        // Tooltip events
        if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
          this.button.addEventListener('mouseenter', () => {
            console.log('Button hover - showing tooltip');
            this.showTooltip();
          });
          
          this.button.addEventListener('mouseleave', () => {
            console.log('Button leave - hiding tooltip');
            this.hideTooltip();
          });
        } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
          this.showTooltip();
        }
      },
      
      showModal() {
        this.modal.style.display = 'block';
        this.hideTooltip();
        
        if (this.videoElement) {
          console.log('Starting video with sound');
          this.videoElement.muted = false;
          this.videoElement.play().catch(e => {
            console.log('Video autoplay failed, starting muted');
            this.videoElement.muted = true;
            this.videoElement.play();
          });
        }
      },
      
      hideModal() {
        this.modal.style.display = 'none';
        
        if (this.videoElement) {
          console.log('Muting and pausing video');
          this.videoElement.muted = true;
          this.videoElement.pause();
        }
      },
      
      showTooltip() {
        if (this.tooltip && '{{TOOLTIP_DISPLAY}}' !== 'never') {
          this.tooltip.style.display = 'block';
        }
      },
      
      hideTooltip() {
        if (this.tooltip) {
          this.tooltip.style.display = 'none';
        }
      }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => widget.init());
    } else {
      widget.init();
    }
  `
};

export const getDefaultTemplate = () => defaultTemplate;
