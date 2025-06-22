
import type { WidgetTemplate } from '../template-types.ts'

export const getMinimalTemplate = (): WidgetTemplate => ({
  id: 'minimal',
  name: 'Minimal Clean',
  description: 'Clean and minimal design with subtle animations',
  html: `
<!-- Minimal Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: {{BUTTON_COLOR}};">
    {{BUTTON_ICON}}
  </button>
</div>

<!-- Floating Channel Icons -->
<div class="hiclient-floating-channels" style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); z-index: 99998; display: flex; flex-direction: column; gap: 12px;">
  {{CHANNELS_HTML}}
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">{{GREETING_MESSAGE}}</div>
    <div class="hiclient-modal-close">×</div>
    {{VIDEO_CONTENT}}
    <div class="hiclient-empty-state" style="display: none;">
      <div class="hiclient-empty-icon">📞</div>
      <p>No channels configured</p>
    </div>
  </div>
</div>`,
  
  css: `
/* Minimal CSS */
.hiclient-widget-container {
  font-family: system-ui, -apple-system, sans-serif;
}

.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: {{BUTTON_COLOR}};
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  overflow: hidden;
}

.hiclient-widget-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hiclient-tooltip {
  position: absolute;
  background: white;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100000;
  transition: opacity 0.15s ease;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

/* Floating Channel Icons */
.hiclient-floating-channels {
  font-family: system-ui, -apple-system, sans-serif;
}

.hiclient-channel-float {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: white;
  font-size: 20px;
}

.hiclient-channel-float:hover {
  transform: translateX(-5px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.hiclient-channel-tooltip {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 100001;
}

.hiclient-channel-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: #333;
}

.hiclient-channel-float:hover .hiclient-channel-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(-5px);
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
  transition: all 0.2s ease;
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.95);
  transition: transform 0.2s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1);
}

.hiclient-modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #9ca3af;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.hiclient-modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.hiclient-modal-header {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  text-align: center;
  padding-right: 32px;
}

.hiclient-video-container {
  margin-bottom: 16px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
}

.hiclient-empty-state {
  text-align: center;
  padding: 32px 16px;
  color: #6b7280;
}

.hiclient-empty-icon {
  width: 28px;
  height: 28px;
  margin: 0 auto 10px;
  opacity: 0.5;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .hiclient-floating-channels {
    right: 10px;
    gap: 8px;
  }
  
  .hiclient-channel-float {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .hiclient-channel-tooltip {
    right: 55px;
    font-size: 11px;
    padding: 6px 10px;
  }
}`,
  
  js: `/* Minimal JS */
function initializeWidget() {
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  var emptyState = document.querySelector(".hiclient-empty-state");
  
  console.log('Minimal widget initialized with greeting:', '{{GREETING_MESSAGE}}');
  console.log('Tooltip position:', '{{TOOLTIP_POSITION}}');
  
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Show/hide empty state based on channels (only for modal, not floating icons)
  if (emptyState) {
    var hasChannels = {{CHANNELS_COUNT}} > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  if (button && modal) {
    button.addEventListener("click", function() {
      modal.classList.add("show");
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(function(error) {
          console.log("Video error:", error);
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
      closeBtn.addEventListener("click", closeModal);
    }
    
    modal.addEventListener("click", function(e) {
      if (e.target === modal) closeModal();
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
        tooltip.classList.add("show");
      });
      button.addEventListener("mouseleave", function() {
        tooltip.classList.add("hide");
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
