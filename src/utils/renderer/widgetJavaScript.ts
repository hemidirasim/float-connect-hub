
import { TemplateConfig } from './types';

export class WidgetJavaScript {
  constructor(private config: TemplateConfig) {}

  getWidgetJavaScript(): string {
    return `
      console.log('Widget JavaScript loaded (fallback)');
      
      // Function to handle widget initialization
      function initializeWidget() {
        console.log('Initializing widget (fallback)...');
        
        var button = document.querySelector('.hiclient-widget-button');
        var modal = document.querySelector('.hiclient-modal-backdrop');
        var tooltip = document.querySelector('.hiclient-tooltip');
        var closeBtn = document.querySelector('.hiclient-modal-close');
        
        console.log('Found elements:', { button: !!button, modal: !!modal, tooltip: !!tooltip, closeBtn: !!closeBtn });
        
        if (button && modal) {
          // Button click handler
          button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Widget button clicked (fallback), showing modal');
            modal.classList.add('show');
          });
          
          // Close button handler
          if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log('Close button clicked (fallback)');
              modal.classList.remove('show');
            });
          }
          
          // Backdrop click handler
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              console.log('Backdrop clicked (fallback), closing modal');
              modal.classList.remove('show');
            }
          });
          
          // ESC key handler
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
              console.log('ESC pressed (fallback), closing modal');
              modal.classList.remove('show');
            }
          });
        }
        
        // Tooltip hover effects
        if (tooltip && button && '${this.config.tooltipDisplay}' === 'hover') {
          button.addEventListener('mouseenter', function() {
            console.log('Button hover (fallback) - showing tooltip');
            tooltip.classList.remove('hide');
            tooltip.classList.add('show');
          });
          
          button.addEventListener('mouseleave', function() {
            console.log('Button leave (fallback) - hiding tooltip');
            tooltip.classList.remove('show');
            tooltip.classList.add('hide');
          });
        }
        
        // Global channel opener
        window.openChannel = function(url) {
          console.log('Opening channel (fallback):', url);
          window.open(url, '_blank');
        };
        
        console.log('Widget initialization complete (fallback)');
      }
      
      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
      } else {
        initializeWidget();
      }
    `;
  }
}
