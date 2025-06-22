import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Gradient',
  description: 'Modern template with gradient effects and smooth animations',
  html: `
<!-- Minimalist Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 24px; z-index: 99999;">
  
  <!-- Main Button -->
  <div class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px;">
    <div class="hiclient-button-inner">
      {{BUTTON_ICON}}
    </div>
  </div>
  
  <!-- Tooltip -->
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">
    {{TOOLTIP_TEXT}}zzzzz
  </div>
</div>

<!-- Modal -->
<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">
      <h3>{{GREETING_MESSAGE}}</h3>
      <button class="hiclient-modal-close" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m18 6-12 12M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    {{VIDEO_CONTENT}}
    
    <div class="hiclient-channels-list">
      {{CHANNELS_HTML}}
    </div>
    
    <div class="hiclient-empty-state" style="display: none;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
      <p>Heç bir əlaqə mövcud deyil</p>
    </div>
  </div>
</div>`,

  css: `
/* Minimalist Clean CSS */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  user-select: none;
}

/* Main Button */
.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: #1a1a1a;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.hiclient-button-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  transition: all 0.15s ease;
}

.hiclient-widget-button:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: #2a2a2a;
}

.hiclient-widget-button:active {
  transform: scale(0.95);
}

/* Tooltip */
.hiclient-tooltip {
  position: absolute;
  background: #1a1a1a;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100001;
  transition: all 0.15s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hiclient-tooltip::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background: #1a1a1a;
  transform: rotate(45deg);
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

/* Modal */
.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: #ffffff;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  transform: scale(0.9) translateY(20px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) translateY(0);
}

.hiclient-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.hiclient-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  padding-bottom: 16px;
}

.hiclient-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hiclient-modal-close:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

.hiclient-video-container {
  margin: 0 24px 24px 24px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.hiclient-channels-list {
  padding: 0 24px 24px 24px;
  max-height: 300px;
  overflow-y: auto;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  color: inherit;
  background: #ffffff;
}

.hiclient-channel-item:last-child {
  margin-bottom: 0;
}

.hiclient-channel-item:hover {
  background: #f8f9fa;
  border-color: #1a1a1a;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.hiclient-channel-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 500;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a1a;
  margin: 0 0 2px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hiclient-external-icon {
  width: 18px;
  height: 18px;
  color: #999;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.hiclient-channel-item:hover .hiclient-external-icon {
  color: #1a1a1a;
  transform: translateX(2px);
}

.hiclient-empty-state {
  text-align: center;
  padding: 60px 24px;
  color: #999;
}

.hiclient-empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.hiclient-empty-state p {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

/* Scrollbar styling */
.hiclient-channels-list::-webkit-scrollbar {
  width: 4px;
}

.hiclient-channels-list::-webkit-scrollbar-track {
  background: transparent;
}

.hiclient-channels-list::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 2px;
}

.hiclient-channels-list::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}`,

  js: `/* Minimalist JS */
console.log("Minimalist widget initialized");

function initializeWidget() {
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  var channelsList = document.querySelector(".hiclient-channels-list");
  var emptyState = document.querySelector(".hiclient-empty-state");
  
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Show/hide empty state
  if (channelsList && emptyState) {
    var hasChannels = channelsList.children.length > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      modal.classList.add("show");
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(function(error) {
          console.log("Video autoplay blocked:", error);
        });
      }
    });
    
    function closeModal() {
      modal.classList.remove("show");
      document.body.style.overflow = ''; // Restore scroll
      if (video) {
        video.muted = true;
        video.pause();
      }
    }
    
    if (closeBtn) {
      closeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
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
  
  // Tooltip functionality
  if (tooltip && button) {
    if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
      button.addEventListener("mouseenter", function() {
        tooltip.classList.add("show");
        tooltip.classList.remove("hide");
      });
      button.addEventListener("mouseleave", function() {
        tooltip.classList.remove("show");
        tooltip.classList.add("hide");
      });
    } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
      tooltip.style.display = 'block';
      tooltip.classList.add("show");
    }
  }
  
  // Channel opening function
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