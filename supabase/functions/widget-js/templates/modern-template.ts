import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Contact Button',
  description: 'Clean floating contact button with modern modal design positioned above the button',
  html: `
<div class="hiclient-widget" style="position: fixed; {{POSITION_STYLE}} bottom: 24px; z-index: 99999;">
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button class="hiclient-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: {{BUTTON_COLOR}};">
    {{BUTTON_ICON}}
  </button>
</div>

<div class="hiclient-modal">
  <div class="hiclient-modal-overlay"></div>
  <div class="hiclient-modal-container">
    <div class="hiclient-modal-header">
      <h2>{{GREETING_MESSAGE}}</h2>
      <button class="hiclient-close">×</button>
    </div>
    
    {{VIDEO_CONTENT}}
    
    <div class="hiclient-channels">
      {{CHANNELS_HTML}}
    </div>
    
    <div class="hiclient-empty" style="display: none;">
      <div class="hiclient-empty-icon">💬</div>
      <p>No contact methods available</p>
    </div>
  </div>
</div>`,

  css: `
/* Modern Contact Widget */
.hiclient-widget {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hiclient-button {
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  font-size: 24px;
}

.hiclient-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.hiclient-button:active {
  transform: scale(1.05);
}

.hiclient-tooltip {
  position: absolute;
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.hiclient-tooltip::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 5px solid transparent;
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

.hiclient-modal {
  position: fixed;
  bottom: calc(24px + {{BUTTON_SIZE}}px + 16px); /* Position above button with gap */
  right: 24px; /* Align with button's right position */
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hiclient-modal.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal.show ~ .hiclient-widget {
  opacity: 0;
  visibility: hidden;
}

.hiclient-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.hiclient-modal-container {
  position: relative;
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.hiclient-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.hiclient-modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.hiclient-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.hiclient-close:hover {
  background: #ef4444;
  color: white;
}

.hiclient-video-container {
  padding: 0 20px 20px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 8px;
}

.hiclient-channels {
  padding: 0 20px 20px;
  max-height: 300px;
  overflow-y: auto;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  cursor: pointer;
}

.hiclient-channel-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.hiclient-channel-item:last-child {
  margin-bottom: 0;
}

.hiclient-channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 500;
  font-size: 15px;
  color: #111827;
  margin: 0 0 2px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.hiclient-external-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.hiclient-channel-item:hover .hiclient-external-icon {
  transform: translateX(2px);
}

.hiclient-empty {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.hiclient-empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.hiclient-empty p {
  margin: 0;
  font-size: 14px;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  .hiclient-modal-container {
    background: #1f2937;
  }
  
  .hiclient-modal-header {
    border-bottom-color: #374151;
  }
  
  .hiclient-modal-header h2 {
    color: white;
  }
  
  .hiclient-close {
    background: #374151;
    color: #d1d5db;
  }
  
  .hiclient-channel-item {
    border-color: #374151;
    color: white;
  }
  
  .hiclient-channel-item:hover {
    background: #374151;
    border-color: #4b5563;
  }
  
  .hiclient-channel-label {
    color: white;
  }
  
  .hiclient-channel-value {
    color: #d1d5db;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .hiclient-modal {
    bottom: calc(16px + {{BUTTON_SIZE}}px + 8px);
    right: 16px;
  }
  
  .hiclient-modal-container {
    border-radius: 12px;
  }
  
  .hiclient-modal-header {
    padding: 16px;
  }
  
  .hiclient-modal-header h2 {
    font-size: 16px;
  }
  
  .hiclient-channels {
    padding: 0 16px 16px;
  }
  
  .hiclient-video-container {
    padding: 0 16px 16px;
  }
}`,
  
  js: `
function initWidget() {
  const button = document.querySelector('.hiclient-button');
  const modal = document.querySelector('.hiclient-modal');
  const overlay = document.querySelector('.hiclient-modal-overlay');
  const closeBtn = document.querySelector('.hiclient-close');
  const tooltip = document.querySelector('.hiclient-tooltip');
  const video = document.querySelector('.hiclient-video-player');
  const channelsContainer = document.querySelector('.hiclient-channels');
  const emptyState = document.querySelector('.hiclient-empty');
  const widget = document.querySelector('.hiclient-widget');
  
  // Setup video
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Show empty state if needed
  if (channelsContainer && emptyState) {
    const hasChannels = channelsContainer.children.length > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  // Open modal
  if (button) {
    button.addEventListener('click', () => {
      modal.classList.add('show');
      if (widget) {
        widget.style.opacity = '0';
        widget.style.visibility = 'hidden';
      }
      
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    });
  }
  
  // Close modal
  const closeModal = () => {
    modal.classList.remove('show');
    if (widget) {
      widget.style.opacity = '1';
      widget.style.visibility = 'visible';
    }
    if (video) {
      video.muted = true;
      video.pause();
    }
  };
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeModal);
  }
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
  
  // Tooltip
  if (tooltip && button) {
    if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
      button.addEventListener('mouseenter', () => {
        tooltip.classList.add('show');
      });
      button.addEventListener('mouseleave', () => {
        tooltip.classList.add('hide');
      });
    } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
      tooltip.style.display = 'block';
      tooltip.classList.add('show');
    }
  }
}

// Channel click handler
window.openChannel = (url) => {
  window.open(url, '_blank');
};

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}`
});