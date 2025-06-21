import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Minimal Contact Modal with Video',
  description: 'Minimal floating contact modal with active video support',
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
    
    <div class="hiclient-video-container">
      <video class="hiclient-video-player" controls autoplay muted playsinline>
        <source src="{{VIDEO_URL}}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    
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
/* Minimal Contact Widget */
.hiclient-widget {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: opacity 0.3s ease;
}

.hiclient-button {
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  color: white;
  font-size: 20px;
}

.hiclient-button:hover {
  transform: scale(1.1);
}

.hiclient-tooltip {
  position: absolute;
  background: #1f2937;
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.2s ease;
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
  bottom: calc(24px + {{BUTTON_SIZE}}px + 12px);
  right: 24px;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
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
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.hiclient-modal-container {
  background: #ffffff;
  border-radius: 10px;
  width: 100%;
  max-width: 320px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.hiclient-modal.show .hiclient-modal-container {
  transform: translateY(0);
}

.hiclient-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.hiclient-modal-header h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.hiclient-close {
  width: 24px;
  height: 24px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: background 0.2s ease;
}

.hiclient-close:hover {
  background: #ef4444;
  color: white;
}

.hiclient-video-container {
  padding: 12px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 6px;
  background: #000;
}

.hiclient-channels {
  padding: 0 12px 12px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #1f2937;
  font-size: 13px;
}

.hiclient-channel-item:hover {
  background: #f9fafb;
}

.hiclient-channel-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: #e5e7eb;
}

.hiclient-channel-info {
  flex: 1;
  overflow: hidden;
}

.hiclient-channel-label {
  font-weight: 500;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hiclient-channel-value {
  color: #6b7280;
  margin: 0;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hiclient-empty {
  text-align: center;
  padding: 24px 12px;
  color: #6b7280;
}

.hiclient-empty-icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.hiclient-empty p {
  margin: 0;
  font-size: 12px;
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
    color: #f9fafb;
  }
  .hiclient-close {
    background: #374151;
    color: #d1d5db;
  }
  .hiclient-channel-item {
    border-color: #374151;
    color: #f9fafb;
  }
  .hiclient-channel-item:hover {
    background: #374151;
  }
  .hiclient-channel-label {
    color: #f9fafb;
  }
  .hiclient-channel-value {
    color: #d1d5db;
  }
  .hiclient-channel-icon {
    background: #374151;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .hiclient-modal {
    bottom: calc(16px + {{BUTTON_SIZE}}px + 8px);
    right: 16px;
  }
  .hiclient-modal-container {
    max-width: 280px;
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
  
  if (video) {
    video.muted = true; // Başlanğıcda səs səng
    video.pause();
  }
  
  if (channelsContainer && emptyState) {
    emptyState.style.display = channelsContainer.children.length > 0 ? 'none' : 'block';
  }
  
  if (button) {
    button.addEventListener('click', () => {
      modal.classList.add('show');
      if (widget) {
        widget.style.opacity = '0';
        widget.style.visibility = 'hidden';
      }
      if (video) {
        video.muted = false; // Modal açılanda səs açılır
        video.currentTime = 0;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    });
  }
  
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
  
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
  
  if (tooltip && button) {
    if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
      button.addEventListener('mouseenter', () => tooltip.classList.add('show'));
      button.addEventListener('mouseleave', () => tooltip.classList.add('hide'));
    } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
      tooltip.style.display = 'block';
      tooltip.classList.add('show');
    }
  }
}

window.openChannel = (url) => window.open(url, '_blank');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}`
});