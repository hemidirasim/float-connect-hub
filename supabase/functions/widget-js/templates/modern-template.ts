
import type { WidgetTemplate } from '../template-generator.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Gradient',
  description: 'Modern template with gradient effects and smooth animations',
  html_template: `
<!-- Modern Template -->
<div class="hiclient-widget-container" style="position: fixed; {{position}}: 20px; bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip {{tooltip_class}}" style="{{tooltip_style}}">{{tooltip_text}}</div>
  <button class="hiclient-widget-button" style="{{button_style}}">
    {{button_icon}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">Get in Touch</div>
    <div class="hiclient-modal-close">×</div>
    {{video_section}}
    {{channels_section}}
    {{empty_state}}
  </div>
</div>`,
  
  css_template: `
/* Modern Gradient CSS */
.hiclient-widget-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.hiclient-widget-button {
  width: {{button_size}}px;
  height: {{button_size}}px;
  border-radius: 50%;
  background: linear-gradient(135deg, {{button_color}} 0%, #667eea 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(102, 126, 234, 0.5);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(102, 126, 234, 0.5);
  }
  70% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

.hiclient-widget-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  animation-play-state: paused;
}

.hiclient-tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100000;
  transition: all 0.3s ease;
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
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(102, 126, 234, 0.2) 100%);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  backdrop-filter: blur(10px);
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 32px;
  border-radius: 20px;
  max-width: 28rem;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.8) rotateX(10deg);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) rotateX(0deg);
}

.hiclient-modal-close {
  position: absolute;
  top: 20px;
  right: 24px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #64748b;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
}

.hiclient-modal-close:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg);
}

.hiclient-modal-header {
  margin: 0 0 28px 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  line-height: 1.4;
  padding-right: 50px;
}

.hiclient-video-container {
  margin-bottom: 28px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.hiclient-channels-container {
  max-height: 320px;
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
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
}

.hiclient-channel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s ease;
}

.hiclient-channel-item:hover::before {
  left: 100%;
}

.hiclient-channel-item:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.hiclient-channel-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 600;
  font-size: 16px;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 14px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
}

.hiclient-external-icon {
  width: 20px;
  height: 20px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.hiclient-channel-item:hover .hiclient-external-icon {
  color: #667eea;
  transform: translateX(2px);
}

.hiclient-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.hiclient-empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
  opacity: 0.4;
}`,
  
  js_template: `/* Modern JS */
function initializeWidget() {
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
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
    button.addEventListener("mouseenter", function() {
      tooltip.classList.add("show");
    });
    button.addEventListener("mouseleave", function() {
      tooltip.classList.add("hide");
    });
  }
  
  window.openChannel = function(url) {
    window.open(url, "_blank");
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}`,
  is_active: true,
  is_default: false
});
