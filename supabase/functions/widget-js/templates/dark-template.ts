import type { WidgetTemplate } from '../template-types.ts'

export const getDarkTemplate = (): WidgetTemplate => ({
  id: 'dark',
  name: 'Dark Theme',
  description: 'Modern dark-themed widget with sleek design',
  html: `
<!-- Dark Theme Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip" id="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button class="hiclient-widget-button" id="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: {{BUTTON_COLOR}};">
    {{BUTTON_ICON}}
  </button>
</div>

<div class="hiclient-modal-backdrop" id="hiclient-modal-backdrop">
  <div class="hiclient-modal-content" id="hiclient-modal-content">
    <div class="hiclient-modal-header">{{GREETING_MESSAGE}}</div>
    <div class="hiclient-modal-close" id="hiclient-modal-close">×</div>
    {{VIDEO_CONTENT}}
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
/* Dark Theme CSS */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: {{BUTTON_COLOR}};
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.hiclient-widget-button:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
}

.hiclient-tooltip {
  position: absolute;
  background: rgba(20, 20, 20, 0.95);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 100000;
  transition: all 0.2s ease;
  pointer-events: none;
  backdrop-filter: blur(10px);
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
  background: rgba(0, 0, 0, 0.9);
  z-index: 100000;
  display: none;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
  display: flex;
}

.hiclient-modal-content {
  background: #1a1a1a;
  color: white;
  padding: 28px;
  border-radius: 16px;
  max-width: 28rem;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(20px);
  transition: transform 0.3s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  border: 1px solid #333;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) translateY(0);
}

.hiclient-modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #888;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-weight: 300;
}

.hiclient-modal-close:hover {
  background: #333;
  color: #fff;
}

.hiclient-modal-header {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  line-height: 1.4;
  padding-right: 40px;
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
  grid-template-columns: 1fr;
  gap: 12px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #333;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: #222;
}

.hiclient-channel-item:hover {
  background-color: #2a2a2a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #444;
}

.hiclient-channel-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
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
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 13px;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
}

.hiclient-external-icon {
  width: 18px;
  height: 18px;
  color: #666;
  flex-shrink: 0;
}

.hiclient-empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #888;
}

.hiclient-empty-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  opacity: 0.4;
}`,
  
  js: `/* Dark Theme JS */
console.log("Dark theme widget loaded with greeting:", '{{GREETING_MESSAGE}}');

function initializeWidget() {
  var button = document.getElementById("hiclient-widget-button");
  var modal = document.getElementById("hiclient-modal-backdrop");
  var tooltip = document.getElementById("hiclient-tooltip");
  var closeBtn = document.getElementById("hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  var channelsContainer = document.querySelector(".hiclient-channels-container");
  var emptyState = document.querySelector(".hiclient-empty-state");
  
  if (video) {
    video.muted = true;
    video.pause();
    video.currentTime = 0;
  }
  
  // Show/hide empty state based on channels
  if (channelsContainer && emptyState) {
    var hasChannels = channelsContainer.children.length > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.add("show");
      
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(function(error) {
          console.log("Video play error:", error);
        });
      }
    });
    
    function closeModal() {
      modal.classList.remove("show");
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
  
  if (tooltip && button) {
    if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
      button.addEventListener("mouseenter", function() {
        tooltip.classList.remove("hide");
        tooltip.classList.add("show");
        tooltip.style.display = 'block';
      });
      
      button.addEventListener("mouseleave", function() {
        tooltip.classList.remove("show");
        tooltip.classList.add("hide");
        setTimeout(function() {
          if (tooltip.classList.contains("hide")) {
            tooltip.style.display = 'none';
          }
        }, 200);
      });
    } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
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