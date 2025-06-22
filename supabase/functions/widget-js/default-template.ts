import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Minimal',
  description: 'Clean, minimal modern design with subtle animations',
  html: `
<!-- Modern Minimal Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 24px; z-index: 99999;">
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px;">
    {{BUTTON_ICON}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">{{GREETING_MESSAGE}}</div>
    <button class="hiclient-modal-close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    {{VIDEO_CONTENT}}
    <div class="hiclient-channels-container">
      {{CHANNELS_HTML}}
    </div>
    <div class="hiclient-empty-state" style="display: none;">
      <div class="empty-icon">📞</div>
      <p>No contact channels configured</p>
    </div>
  </div>
</div>`,
  
  css: `
/* Modern Minimal CSS */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: {{BUTTON_COLOR}};
  border: none;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.hiclient-widget-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}

.hiclient-widget-button:active {
  transform: translateY(0);
}

.hiclient-tooltip {
  position: absolute;
  background: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition: all 0.2s ease;
  pointer-events: none;
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
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
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1);
}

.hiclient-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.hiclient-modal-close:hover {
  background: #ef4444;
  color: white;
}

.hiclient-modal-header {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  padding-right: 50px;
  line-height: 1.3;
}

.hiclient-video-container {
  margin-bottom: 24px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.hiclient-channels-container {
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  gap: 12px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  background: white;
}

.hiclient-channel-item:hover {
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.hiclient-channel-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f9fafb;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hiclient-external-icon {
  width: 20px;
  height: 20px;
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
  padding: 48px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.hiclient-empty-state p {
  margin: 0;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 480px) {
  .hiclient-modal-content {
    padding: 24px;
    border-radius: 12px;
  }
  
  .hiclient-modal-header {
    font-size: 20px;
  }
  
  .hiclient-channel-item {
    padding: 12px;
  }
  
  .hiclient-channel-icon {
    width: 40px;
    height: 40px;
  }
}`,
  
  js: `/* Modern Minimal JS */
console.log("Modern minimal widget initialized");

function initializeWidget() {
  const button = document.querySelector(".hiclient-widget-button");
  const modal = document.querySelector(".hiclient-modal-backdrop");
  const tooltip = document.querySelector(".hiclient-tooltip");
  const closeBtn = document.querySelector(".hiclient-modal-close");
  const video = document.querySelector(".hiclient-video-player");
  const channelsContainer = document.querySelector(".hiclient-channels-container");
  const emptyState = document.querySelector(".hiclient-empty-state");
  
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Show/hide empty state
  if (channelsContainer && emptyState) {
    const hasChannels = channelsContainer.children.length > 0;
    emptyState.style.display = hasChannels ? 'none' : 'block';
  }
  
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      modal.classList.add("show");
      document.body.style.overflow = 'hidden';
      
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(console.log);
      }
    });
    
    function closeModal() {
      modal.classList.remove("show");
      document.body.style.overflow = '';
      
      if (video) {
        video.muted = true;
        video.pause();
      }
    }
    
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
    
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }
  
  // Tooltip
  if (tooltip && button) {
    const tooltipDisplay = '{{TOOLTIP_DISPLAY}}';
    
    if (tooltipDisplay === 'hover') {
      button.addEventListener("mouseenter", function() {
        tooltip.classList.add("show");
      });
      
      button.addEventListener("mouseleave", function() {
        tooltip.classList.remove("show");
      });
    } else if (tooltipDisplay === 'always') {
      tooltip.style.display = 'block';
      tooltip.classList.add("show");
    }
  }
  
  window.openChannel = function(url) {
    window.open(url, "_blank");
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}`
});