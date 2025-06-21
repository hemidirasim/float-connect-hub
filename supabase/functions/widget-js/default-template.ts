import type { WidgetTemplate } from './template-types.ts'

export const modernTemplate: WidgetTemplate = {
  id: 'modern',
  name: 'Modern Glass Template',
  description: 'Ultra-modern glassmorphism widget with smooth animations',
  
  html: `
    <div id="lovable-widget-root" class="lovable-widget-root">
      <!-- Floating Action Button -->
      <div class="lovable-fab-container">
        <div id="lovable-tooltip" class="lovable-tooltip" data-display="{{TOOLTIP_DISPLAY}}">
          <span class="lovable-tooltip-text">{{TOOLTIP_TEXT}}</span>
          <div class="lovable-tooltip-arrow"></div>
        </div>
        
        <button id="lovable-fab" class="lovable-fab" aria-label="Open contact widget">
          <div class="lovable-fab-ripple"></div>
          <div class="lovable-fab-icon">{{BUTTON_ICON}}</div>
          <div class="lovable-fab-backdrop"></div>
        </button>
      </div>

      <!-- Modal Overlay -->
      <div id="lovable-modal-overlay" class="lovable-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="lovable-modal-backdrop"></div>
        
        <div class="lovable-modal-container">
          <div class="lovable-modal-content">
            <!-- Header -->
            <header class="lovable-modal-header">
              <div class="lovable-modal-title-section">
                <h2 id="modal-title" class="lovable-modal-title">{{GREETING_MESSAGE}}</h2>
                <p class="lovable-modal-subtitle">Choose your preferred way to connect</p>
              </div>
              
              <button id="lovable-close-btn" class="lovable-close-btn" aria-label="Close dialog">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </header>

            <!-- Video Section -->
            <div class="lovable-video-section">
              {{VIDEO_CONTENT}}
            </div>

            <!-- Channels -->
            <div class="lovable-channels-section">
              <div id="lovable-channels-grid" class="lovable-channels-grid">
                {{CHANNELS_HTML}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  css: `
    /* CSS Variables for theming */
    .lovable-widget-root {
      --primary-color: {{BUTTON_COLOR}};
      --primary-rgb: 59, 130, 246;
      --shadow-color: rgba(0, 0, 0, 0.1);
      --glass-bg: rgba(255, 255, 255, 0.95);
      --glass-border: rgba(255, 255, 255, 0.2);
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --border-radius: 16px;
      --spacing-unit: 8px;
      --animation-speed: 0.3s;
      --blur-amount: 20px;
      
      position: fixed;
      {{POSITION_STYLE}}
      bottom: calc(var(--spacing-unit) * 3);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-primary);
    }

    /* Floating Action Button */
    .lovable-fab-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lovable-fab {
      position: relative;
      width: {{BUTTON_SIZE}}px;
      height: {{BUTTON_SIZE}}px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 80%, #000));
      color: white;
      cursor: pointer;
      overflow: hidden;
      transition: all var(--animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 
        0 4px 20px rgba(var(--primary-rgb), 0.3),
        0 2px 8px rgba(0, 0, 0, 0.1);
      will-change: transform;
    }

    .lovable-fab:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 
        0 8px 30px rgba(var(--primary-rgb), 0.4),
        0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .lovable-fab:active {
      transform: translateY(-1px) scale(1.02);
    }

    .lovable-fab-icon {
      position: relative;
      z-index: 2;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--animation-speed) ease;
    }

    .lovable-fab:hover .lovable-fab-icon {
      transform: rotate(15deg) scale(1.1);
    }

    .lovable-fab-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: all 0.6s ease;
      pointer-events: none;
    }

    .lovable-fab:active .lovable-fab-ripple {
      width: 120%;
      height: 120%;
    }

    .lovable-fab-backdrop {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
      opacity: 0;
      transition: opacity var(--animation-speed) ease;
    }

    .lovable-fab:hover .lovable-fab-backdrop {
      opacity: 1;
    }

    /* Tooltip */
    .lovable-tooltip {
      position: absolute;
      {{TOOLTIP_POSITION_STYLE}}
      background: var(--glass-bg);
      backdrop-filter: blur(var(--blur-amount));
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2);
      border-radius: calc(var(--border-radius) / 2);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      transform: translateY(4px);
      transition: all var(--animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.1),
        0 4px 16px rgba(0, 0, 0, 0.05);
      z-index: 1000000;
    }

    .lovable-tooltip[data-display="always"] {
      opacity: 1;
      transform: translateY(0);
    }

    .lovable-fab-container:hover .lovable-tooltip[data-display="hover"] {
      opacity: 1;
      transform: translateY(0);
    }

    .lovable-tooltip-arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
      bottom: -4px;
      left: 50%;
      margin-left: -4px;
    }

    /* Modal */
    .lovable-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 1000001;
      isolation: isolate;
    }

    .lovable-modal-overlay.active {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-unit);
    }

    .lovable-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      opacity: 0;
      transition: opacity var(--animation-speed) ease;
    }

    .lovable-modal-overlay.active .lovable-modal-backdrop {
      opacity: 1;
    }

    .lovable-modal-container {
      position: relative;
      max-width: 420px;
      width: 100%;
      max-height: 90vh;
      transform: scale(0.9) translateY(20px);
      opacity: 0;
      transition: all var(--animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lovable-modal-overlay.active .lovable-modal-container {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    .lovable-modal-content {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--blur-amount));
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 
        0 25px 60px rgba(0, 0, 0, 0.15),
        0 10px 30px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .lovable-modal-content::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      pointer-events: none;
    }

    /* Modal Header */
    .lovable-modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: calc(var(--spacing-unit) * 3);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      position: relative;
    }

    .lovable-modal-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .lovable-modal-subtitle {
      margin: calc(var(--spacing-unit) / 2) 0 0 0;
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .lovable-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: calc(var(--spacing-unit) / 2);
      border-radius: calc(var(--border-radius) / 2);
      color: var(--text-secondary);
      transition: all var(--animation-speed) ease;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .lovable-close-btn svg {
      width: 18px;
      height: 18px;
    }

    .lovable-close-btn:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--text-primary);
      transform: rotate(90deg);
    }

    /* Video Section */
    .lovable-video-section {
      padding: 0 calc(var(--spacing-unit) * 3);
    }

    .lovable-video-section video {
      width: 100%;
      height: auto;
      border-radius: calc(var(--border-radius) / 2);
      background: #f8fafc;
    }

    /* Channels */
    .lovable-channels-section {
      padding: calc(var(--spacing-unit) * 3);
    }

    .lovable-channels-grid {
      display: grid;
      gap: calc(var(--spacing-unit) * 1.5);
    }

    .lovable-channel-button {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing-unit) * 1.5);
      padding: calc(var(--spacing-unit) * 2);
      border: 1.5px solid rgba(0, 0, 0, 0.08);
      border-radius: calc(var(--border-radius) / 1.5);
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 600;
      font-size: 14px;
      transition: all var(--animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .lovable-channel-button::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 80%, #000));
      opacity: 0;
      transition: opacity var(--animation-speed) ease;
    }

    .lovable-channel-button:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 
        0 8px 25px rgba(var(--primary-rgb), 0.15),
        0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .lovable-channel-button:hover::before {
      opacity: 0.05;
    }

    .lovable-channel-button:active {
      transform: translateY(-1px);
    }

    .lovable-channel-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .lovable-channel-icon img,
    .lovable-channel-icon svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* Responsive Design */
    @media (max-width: 480px) {
      .lovable-widget-root {
        bottom: calc(var(--spacing-unit) * 2);
        right: calc(var(--spacing-unit) * 2);
        left: calc(var(--spacing-unit) * 2);
      }
      
      .lovable-modal-container {
        max-width: 100%;
        margin: calc(var(--spacing-unit) * 2);
      }
      
      .lovable-modal-header,
      .lovable-video-section,
      .lovable-channels-section {
        padding: calc(var(--spacing-unit) * 2);
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    @media (prefers-color-scheme: dark) {
      .lovable-widget-root {
        --glass-bg: rgba(30, 41, 59, 0.95);
        --glass-border: rgba(255, 255, 255, 0.1);
        --text-primary: #f1f5f9;
        --text-secondary: #94a3b8;
        --shadow-color: rgba(0, 0, 0, 0.3);
      }
      
      .lovable-channel-button {
        background: rgba(30, 41, 59, 0.8);
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  `,
  
  js: `
    // Modern Widget Controller with TypeScript-like structure
    class LovableWidget {
      private elements: {
        root: HTMLElement | null;
        fab: HTMLButtonElement | null;
        modal: HTMLElement | null;
        tooltip: HTMLElement | null;
        closeBtn: HTMLButtonElement | null;
        video: HTMLVideoElement | null;
      };
      
      private config: {
        channels: number;
        buttonColor: string;
        position: string;
        tooltipText: string;
        tooltipDisplay: string;
        greetingMessage: string;
      };
      
      private isOpen: boolean = false;
      private animationFrameId: number | null = null;

      constructor() {
        this.elements = {
          root: null,
          fab: null,
          modal: null,
          tooltip: null,
          closeBtn: null,
          video: null
        };
        
        this.config = {
          channels: {{CHANNELS_COUNT}},
          buttonColor: '{{BUTTON_COLOR}}',
          position: '{{POSITION}}',
          tooltipText: '{{TOOLTIP_TEXT}}',
          tooltipDisplay: '{{TOOLTIP_DISPLAY}}',
          greetingMessage: '{{GREETING_MESSAGE}}'
        };
        
        console.log('🚀 Initializing Modern Lovable Widget', this.config);
      }

      public init(): void {
        this.bindElements();
        
        if (!this.validateElements()) {
          console.error('❌ Widget initialization failed: Required elements not found');
          return;
        }
        
        this.setupEventListeners();
        this.initializeTooltip();
        this.preloadAssets();
        
        console.log('✅ Modern Widget initialized successfully');
      }

      private bindElements(): void {
        this.elements.root = document.getElementById('lovable-widget-root');
        this.elements.fab = document.getElementById('lovable-fab') as HTMLButtonElement;
        this.elements.modal = document.getElementById('lovable-modal-overlay');
        this.elements.tooltip = document.getElementById('lovable-tooltip');
        this.elements.closeBtn = document.getElementById('lovable-close-btn') as HTMLButtonElement;
        this.elements.video = document.querySelector('#lovable-modal-overlay video') as HTMLVideoElement;
      }

      private validateElements(): boolean {
        return !!(this.elements.root && this.elements.fab && this.elements.modal);
      }

      private setupEventListeners(): void {
        // FAB click handler
        this.elements.fab?.addEventListener('click', this.handleFabClick.bind(this));
        
        // Close button handler
        this.elements.closeBtn?.addEventListener('click', this.handleCloseClick.bind(this));
        
        // Modal backdrop handler
        this.elements.modal?.addEventListener('click', this.handleBackdropClick.bind(this));
        
        // Keyboard handlers
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Channel click tracking
        this.setupChannelTracking();
        
        console.log('📎 Event listeners attached');
      }

      private setupChannelTracking(): void {
        const channels = document.querySelectorAll('.lovable-channel-button');
        channels.forEach((channel, index) => {
          channel.addEventListener('click', () => {
            console.log(\`📱 Channel clicked: \${channel.textContent?.trim()} (index: \${index})\`);
            
            // Add click animation
            channel.style.transform = 'scale(0.98)';
            setTimeout(() => {
              channel.style.transform = '';
            }, 150);
          });
        });
      }

      private initializeTooltip(): void {
        if (!this.elements.tooltip) return;
        
        const display = this.config.tooltipDisplay;
        
        if (display === 'always') {
          this.showTooltip();
        } else if (display === 'hover') {
          this.elements.fab?.addEventListener('mouseenter', this.handleTooltipShow.bind(this));
          this.elements.fab?.addEventListener('mouseleave', this.handleTooltipHide.bind(this));
        }
      }

      private handleFabClick(event: Event): void {
        event.preventDefault();
        console.log('🎯 FAB clicked - opening modal');
        this.openModal();
      }

      private handleCloseClick(event: Event): void {
        event.preventDefault();
        console.log('❌ Close button clicked');
        this.closeModal();
      }

      private handleBackdropClick(event: Event): void {
        if (event.target === this.elements.modal) {
          console.log('🎭 Backdrop clicked - closing modal');
          this.closeModal();
        }
      }

      private handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && this.isOpen) {
          console.log('⌨️ Escape key pressed - closing modal');
          this.closeModal();
        }
      }

      private handleTooltipShow(): void {
        this.showTooltip();
      }

      private handleTooltipHide(): void {
        this.hideTooltip();
      }

      private openModal(): void {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.elements.modal?.classList.add('active');
        this.hideTooltip();
        
        // Focus management
        this.elements.closeBtn?.focus();
        
        // Handle video
        this.handleVideoPlay();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        console.log('📂 Modal opened');
      }

      private closeModal(): void {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.elements.modal?.classList.remove('active');
        
        // Handle video
        this.handleVideoPause();
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to FAB
        this.elements.fab?.focus();
        
        console.log('📁 Modal closed');
      }

      private showTooltip(): void {
        if (this.elements.tooltip && this.config.tooltipDisplay !== 'never') {
          this.elements.tooltip.style.opacity = '1';
          this.elements.tooltip.style.transform = 'translateY(0)';
        }
      }

      private hideTooltip(): void {
        if (this.elements.tooltip) {
          this.elements.tooltip.style.opacity = '0';
          this.elements.tooltip.style.transform = 'translateY(4px)';
        }
      }

      private handleVideoPlay(): void {
        if (!this.elements.video) return;
        
        console.log('🎥 Starting video playback');
        
        // Try to play with sound first
        this.elements.video.muted = false;
        
        this.elements.video.play()
          .then(() => {
            console.log('🔊 Video playing with sound');
          })
          .catch((error) => {
            console.log('🔇 Autoplay blocked, falling back to muted');
            this.elements.video!.muted = true;
            return this.elements.video!.play();
          })
          .catch((error) => {
            console.warn('⚠️ Video playback failed:', error);
          });
      }

      private handleVideoPause(): void {
        if (!this.elements.video) return;
        
        console.log('⏸️ Pausing video');
        this.elements.video.pause();
        this.elements.video.muted = true;
      }

      private preloadAssets(): void {
        // Preload any images or assets for better performance
        const images = document.querySelectorAll('.lovable-channel-icon img');
        images.forEach((img) => {
          if (img instanceof HTMLImageElement && !img.complete) {
            img.loading = 'lazy';
          }
        });
      }

      // Public API methods
      public open(): void {
        this.openModal();
      }

      public close(): void {
        this.closeModal();
      }

      public toggle(): void {
        this.isOpen ? this.closeModal() : this.openModal();
      }

      public destroy(): void {
        // Cleanup event listeners and elements
        document.removeEventListener('keydown', this.handleKeydown.bind(this));
        
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
        }
        
        console.log('🗑️ Widget destroyed');
      }
    }

    // Initialize the widget
    const widget = new LovableWidget();

    // Smart initialization
    const initWidget = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          widget.init();
        });
      } else {
        // DOM is already loaded
        widget.init();
      }
    };

    // Make widget globally accessible for external control
    (window as any).LovableWidget = widget;

    // Start initialization
    initWidget();

    // Performance monitoring
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('lovable-widget-script-end');
    }
  `
};

export const getModernTemplate = () => modernTemplate;