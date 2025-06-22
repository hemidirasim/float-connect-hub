
import type { WidgetTemplate } from './template-types.ts'

export const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Modern Clean Template', 
  description: 'Modern and clean floating widget with green accent',
  html: `
    <div id="lovable-widget-container" style="position: fixed; z-index: 999999; bottom: 20px; {{POSITION_STYLE}}">
      <div id="lovable-widget-tooltip" style="display: none; position: absolute; background: rgba(34, 197, 94, 0.9); color: white; padding: 10px 16px; border-radius: 25px; font-size: 14px; white-space: nowrap; z-index: 1000000; {{TOOLTIP_POSITION_STYLE}} backdrop-filter: blur(10px); font-weight: 500; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);">
        {{TOOLTIP_TEXT}}
      </div>
      <button id="lovable-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; border-radius: 50%; border: none; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; cursor: pointer; box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4); display: flex; align-items: center; justify-content: center; font-size: 20px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; border: 3px solid rgba(255, 255, 255, 0.2);">
        {{BUTTON_ICON}}
      </button>

      <div id="lovable-widget-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 1000001; backdrop-filter: blur(8px);">
        <div style="position: absolute; bottom: 2%; right: 2%; background: white; border-radius: 20px; padding: 0; max-width: 400px; width: 90%; max-height: 80vh; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15); border: 1px solid rgba(255, 255, 255, 0.2);">
          <div style="padding: 8px 8px 10px 8px; border-bottom: 1px solid #f1f5f9; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);">
                  👋
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #1e293b; line-height: 1.3;">{{GREETING_MESSAGE}}</h3>
                </div>
              </div>
              <button id="lovable-widget-close" style="background: rgba(148, 163, 184, 0.1); border: none; font-size: 20px; cursor: pointer; color: #64748b; padding: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s ease; font-weight: 300;">×</button>
            </div>
            {{VIDEO_CONTENT}}
          </div>
          <div style="padding: 24px 8px 8px 8px;">
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
      box-shadow: 0 12px 35px rgba(34, 197, 94, 0.5);
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    }
    
    #lovable-widget-close:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      transform: rotate(90deg);
    }
    
    .lovable-channel-button {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 10px;
    border: 1px solid #e2e8f061;
    /* border-radius: 16px; */
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    text-decoration: none;
    color: #334155;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    }
    
    .lovable-channel-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    .lovable-channel-button:hover::before {
      left: 100%;
    }
    
    .lovable-channel-button:hover {
      border-color: #22c55e;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
    }
    
    .lovable-channel-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }
    
    .lovable-channel-info {
      flex: 1;
      min-width: 0;
    }
    
    .lovable-channel-label {
      font-weight: 600;
      font-size: 16px;
      color: #1e293b;
      margin: 0 0 4px 0;
      line-height: 1.3;
    }
    
    .lovable-channel-value {
      font-size: 14px;
      color: #64748b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      line-height: 1.3;
    }
    
    .lovable-channel-arrow {
      width: 20px;
      height: 20px;
      color: #94a3b8;
      flex-shrink: 0;
      transition: all 0.3s ease;
      font-size: 16px;
    }
    
    .lovable-channel-button:hover .lovable-channel-arrow {
      color: #22c55e;
      transform: translateX(4px);
    }

    /* Channel group styles */
    .lovable-channel-group {
      position: relative;
    }
    
    .lovable-group-trigger {
      position: relative;
      cursor: pointer;
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
    
    .lovable-group-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 8px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      min-width: 280px;
      max-width: 320px;
      border: 1px solid #e5e7eb;
      z-index: 1000002;
      display: none;
      overflow: hidden;
    }
    
    .lovable-group-dropdown.show {
      display: block;
    }
    
    .lovable-group-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      text-decoration: none;
      color: #374151;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .lovable-group-item:last-child {
      border-bottom: none;
    }
    
    .lovable-group-item:hover {
      background: #f9fafb;
    }
    
    .lovable-group-item-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 16px;
      flex-shrink: 0;
    }
    
    .lovable-group-item-info {
      flex: 1;
      min-width: 0;
    }
    
    .lovable-group-item-label {
      font-weight: 500;
      font-size: 14px;
      color: #1f2937;
      margin: 0 0 2px 0;
      line-height: 1.3;
    }
    
    .lovable-group-item-value {
      font-size: 12px;
      color: #6b7280;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
      line-height: 1.3;
    }

    @media (max-width: 768px) {
      .lovable-group-dropdown {
        right: -20px;
        left: -20px;
        min-width: auto;
        max-width: none;
      }
    }
  `,
  
  js: `
    console.log('Initializing Modern Widget with config:', {
      channels: {{CHANNELS_COUNT}},
      buttonColor: '{{BUTTON_COLOR}}',
      position: '{{POSITION}}',
      tooltip: '{{TOOLTIP_TEXT}}',
      greetingMessage: '{{GREETING_MESSAGE}}',
      tooltipPosition: '{{TOOLTIP_POSITION}}'
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
        this.initChannelGroups();
        console.log('Modern widget initialized successfully');
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
        
        // ESC key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.modal.style.display === 'block') {
            console.log('ESC pressed, closing modal');
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

      initChannelGroups() {
        // Initialize channel group functionality
        const groupTriggers = document.querySelectorAll('.lovable-group-trigger');
        
        groupTriggers.forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const group = trigger.closest('.lovable-channel-group');
            const dropdown = group.querySelector('.lovable-group-dropdown');
            
            if (dropdown) {
              // Close all other dropdowns
              this.closeAllDropdowns();
              
              // Toggle current dropdown
              if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
              } else {
                dropdown.classList.add('show');
              }
            }
          });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.lovable-channel-group')) {
            this.closeAllDropdowns();
          }
        });
      },
      
      closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.lovable-group-dropdown');
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
        });
      },
      
      showModal() {
        this.modal.style.display = 'block';
        this.hideTooltip();
        this.closeAllDropdowns();
        
        if (this.videoElement) {
          console.log('Starting video with sound');
          this.videoElement.muted = false;
          this.videoElement.currentTime = 0;
          this.videoElement.play().catch(e => {
            console.log('Video autoplay failed, starting muted');
            this.videoElement.muted = true;
            this.videoElement.play();
          });
        }
      },
      
      hideModal() {
        this.modal.style.display = 'none';
        this.closeAllDropdowns();
        
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
