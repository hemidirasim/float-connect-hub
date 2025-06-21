import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Gradient',
  description: 'Modern template with gradient effects and smooth animations',
  html: `
<!-- Modern Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px;">
    {{BUTTON_ICON}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">{{GREETING_MESSAGE}}</div>
    <div class="hiclient-modal-close">×</div>
    {{VIDEO_CONTENT}}
    <div class="hiclient-channels-container">
      {{CHANNELS_HTML}}
    </div>
    <div class="hiclient-empty-state" style="display: none;">
      <div class="hiclient-empty-icon">💬</div>
      <p>No channels available</p>
    </div>
  </div>
</div>`,
  
  css: `
/* Modern Clean CSS */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
}

.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: {{BUTTON_COLOR}};
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.hiclient-widget-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.hiclient-widget-button:active {
  transform: scale(0.95);
}

.hiclient-tooltip {
  position: absolute;
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 100000;
  transition: all 0.2s ease;
  pointer-events: none;
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
  backdrop-filter: blur(8px);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 24px;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1);
}

.hiclient-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #6b7280;
  border-radius: 50%;
  transition: all 0.2s ease;
  background: #f3f4f6;
}

.hiclient-modal-close:hover {
  background: #ef4444;
  color: white;
}

.hiclient-modal-header {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  padding-right: 40px;
}

.hiclient-video-container {
  margin-bottom: 24px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hiclient-channels-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: white;
}

.hiclient-channel-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hiclient-channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 500;
  font-size: 16px;
  color: #111827;
  margin: 0 0 4px 0;
}

.hiclient-channel-value {
  font-size: 14px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

.hiclient-external-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.hiclient-channel-item:hover .hiclient-external-icon {
  color: #6b7280;
  transform: translateX(2px);
}

.hiclient-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.hiclient-empty-state .hiclient-empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.hiclient-empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .hiclient-modal-content {
    background: #1f2937;
    color: white;
  }
  
  .hiclient-modal-header {
    color: white;
  }
  
  .hiclient-modal-close {
    background: #374151;
    color: #d1d5db;
  }
  
  .hiclient-modal-close:hover {
    background: #ef4444;
    color: white;
  }
  
  .hiclient-channel-item {
    background: #374151;
    border-color: #4b5563;
  }
  
  .hiclient-channel-item:hover {
    background: #4b5563;
    border-color: #6b7280;
  }
  
  .hiclient-channel-label {
    color: white;
  }
  
  .hiclient-channel-value {
    color: #d1d5db;
  }
}

/* Mobile optimization */
@media (max-width: 480px) {
  .hiclient-modal-content {
    padding: 20px;
    border-radius: 12px;
  }
  
  .hiclient-modal-header {
    font-size: 18px;
  }
  
  .hiclient-channel-item {
    padding: 12px;
  }
  
  .hiclient-channel-icon {
    width: 36px;
    height: 36px;
  }
}`,
  
  js: `/* Modern Clean JS */
function initializeWidget() {
  const button = document.querySelector(".hiclient-widget-button");
  const modal = document.querySelector(".hiclient-modal-backdrop");
  const tooltip = document.querySelector(".hiclient-tooltip");
  const closeBtn = document.querySelector(".hiclient-modal-close");
  const video = document.querySelector(".hiclient-video-player");
  const channelsContainer = document.querySelector(".hiclient-channels-container");
  const emptyState = document.querySelector(".hiclient-empty-state");
  
  // Video setup
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Show empty state if no channels
  if (channelsContainer && emptyState) {
    const hasChannels = channelsContainer.children.length > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  // Button click handler
  if (button && modal) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("show");
      
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    });
    
    // Close modal function
    const closeModal = () => {
      modal.classList.remove("show");
      if (video) {
        video.muted = true;
        video.pause();
      }
    };
    
    // Close button
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }
    
    // Click outside to close
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }
  
  // Tooltip handling
  if (tooltip && button) {
    if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
      button.addEventListener("mouseenter", () => {
        tooltip.classList.add("show");
      });
      button.addEventListener("mouseleave", () => {
        tooltip.classList.add("hide");
      });
    } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
      tooltip.style.display = 'block';
      tooltip.classList.add("show");
    }
  }
  
  // Channel click handler
  window.openChannel = (url) => {
    window.open(url, "_blank");
  };
}

// Initialize when ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}`
});