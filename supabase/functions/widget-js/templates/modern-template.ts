import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Minimal',
  description: 'Modern and minimal template with clean design',
  html: `
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: {{BUTTON_COLOR}};">
    {{BUTTON_ICON}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">{{GREETING_MESSAGE}}</div>
    <button class="hiclient-modal-close">×</button>
    <div class="hiclient-video-container">
      {{VIDEO_CONTENT}}
    </div>
    <div class="hiclient-channels-container">
      {{CHANNELS_HTML}}
    </div>
    <div class="hiclient-empty-state" style="display: none;">
      <div class="hiclient-empty-icon">📞</div>
      <p>No channels configured</p>
    </div>
  </div>
</div>`,

  css: `
/* Modern Minimal CSS */
.hiclient-widget-container {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
}

.hiclient-widget-button {
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: {{BUTTON_COLOR}};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  color: white;
  font-size: 20px;
}

.hiclient-widget-button:hover {
  transform: scale(1.1);
}

.hiclient-tooltip {
  position: absolute;
  background: {{BUTTON_COLOR}};
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100000;
  transition: opacity 0.2s ease;
  pointer-events: none;
  font-weight: 500;
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  max-width: 350px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.95);
  transition: transform 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1);
}

.hiclient-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
  border-radius: 50%;
  background: #f9fafb;
  transition: background 0.2s ease;
  border: 1px solid #e5e7eb;
}

.hiclient-modal-close:hover {
  background: #ef4444;
  color: white;
}

.hiclient-modal-header {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  line-height: 1.4;
  padding-right: 40px;
}

.hiclient-video-container {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hiclient-channels-container {
  max-height: 250px;
  overflow-y: auto;
  display: grid;
  gap: 8px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  background: #f9fafb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.hiclient-channel-item:hover {
  transform: translateY(-2px);
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hiclient-channel-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 500;
  font-size: 14px;
  color: #1e293b;
  margin: 0 0 2px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 12px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
}

.hiclient-empty-state {
  text-align: center;
  padding: 30px 20px;
  color: #64748b;
}

.hiclient-empty-icon {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.5;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  .hiclient-modal-content {
    background: #1e293b;
  }
  .hiclient-modal-header {
    color: #f1f5f9;
  }
  .hiclient-modal-close {
    background: #334155;
    color: #94a3b8;
  }
  .hiclient-modal-close:hover {
    background: #ef4444;
    color: white;
  }
  .hiclient-channel-item {
    background: #334155;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  .hiclient-channel-item:hover {
    background: #475569;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  .hiclient-channel-label {
    color: #f1f5f9;
  }
  .hiclient-channel-value {
    color: #94a3b8;
  }
  .hiclient-channel-icon {
    background: #475569;
  }
  .hiclient-empty-state {
    color: #94a3b8;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .hiclient-modal-content {
    max-width: 300px;
    padding: 15px;
  }
  .hiclient-modal-header {
    font-size: 16px;
  }
  .hiclient-channel-item {
    padding: 8px;
  }
  .hiclient-channel-icon {
    width: 28px;
    height: 28px;
  }
}`,

  js: `
function initWidget() {
  const button = document.querySelector('.hiclient-widget-button');
  const modal = document.querySelector('.hiclient-modal-backdrop');
  const closeBtn = document.querySelector('.hiclient-modal-close');
  const tooltip = document.querySelector('.hiclient-tooltip');
  const video = document.querySelector('.hiclient-video-player');
  const channelsContainer = document.querySelector('.hiclient-channels-container');
  const emptyState = document.querySelector('.hiclient-empty-state');
  const widget = document.querySelector('.hiclient-widget-container');

  if (video) {
    video.muted = true;
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
        video.muted = false;
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
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

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