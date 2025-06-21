import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Gradient',
  description: 'Modern template with gradient effects and smooth animations',
  html: `
<!-- Modern Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: linear-gradient(135deg, {{BUTTON_COLOR}} 0%, #667eea 100%);">
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
      <div class="hiclient-empty-icon">📞</div>
      <p>No channels configured</p>
    </div>
  </div>
</div>`,
  
  css: `
/* Modern Gradient CSS */
.hiclient-widget-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: linear-gradient(135deg, {{BUTTON_COLOR}} 0%, #667eea 50%, #764ba2 100%);
  border: none;
  cursor: pointer;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(102, 126, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  animation: gentlePulse 3s ease-in-out infinite;
}

.hiclient-widget-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 2s linear infinite;
}

@keyframes gentlePulse {
  0%, 100% {
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(102, 126, 234, 0.4),
      0 0 0 0 rgba(102, 126, 234, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.2),
      0 6px 18px rgba(102, 126, 234, 0.5),
      0 0 0 8px rgba(102, 126, 234, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.hiclient-widget-button:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.25),
    0 8px 20px rgba(102, 126, 234, 0.6),
    0 0 0 0 rgba(102, 126, 234, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  animation-play-state: paused;
}

.hiclient-widget-button:active {
  transform: scale(1.05) rotate(0deg);
  transition: all 0.1s ease;
}

.hiclient-tooltip {
  position: absolute;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100000;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hiclient-tooltip::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(-5px);
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
  transform: translateY(5px);
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
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  backdrop-filter: blur(15px) saturate(180%);
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 36px;
  border-radius: 28px;
  max-width: 30rem;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  transform: scale(0.7) rotateX(15deg) translateY(50px);
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) rotateX(0deg) translateY(0px);
}

.hiclient-modal-close {
  position: absolute;
  top: 24px;
  right: 28px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 26px;
  color: #64748b;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hiclient-modal-close:hover {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.hiclient-modal-header {
  margin: 0 0 32px 0;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  line-height: 1.3;
  padding-right: 60px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hiclient-video-container {
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.hiclient-video-player {
  width: 100%;
  border-radius: 20px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hiclient-video-container:hover .hiclient-video-player {
  transform: scale(1.02);
}

.hiclient-channels-container {
  max-height: 360px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 4px;
}

.hiclient-channels-container::-webkit-scrollbar {
  width: 6px;
}

.hiclient-channels-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.hiclient-channels-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.hiclient-channel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.6s ease;
}

.hiclient-channel-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hiclient-channel-item:hover::before {
  left: 100%;
}

.hiclient-channel-item:hover::after {
  opacity: 1;
}

.hiclient-channel-item:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 35px rgba(102, 126, 234, 0.15),
    0 0 0 1px rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.hiclient-channel-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hiclient-channel-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: rotate(45deg);
  transition: transform 0.6s ease;
}

.hiclient-channel-item:hover .hiclient-channel-icon {
  transform: rotate(10deg) scale(1.1);
}

.hiclient-channel-item:hover .hiclient-channel-icon::before {
  transform: rotate(45deg) translate(100%, 100%);
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 600;
  font-size: 17px;
  color: #1e293b;
  margin: 0 0 6px 0;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.hiclient-channel-item:hover .hiclient-channel-label {
  color: #667eea;
}

.hiclient-channel-value {
  font-size: 14px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.hiclient-channel-item:hover .hiclient-channel-value {
  color: #475569;
}

.hiclient-external-icon {
  width: 22px;
  height: 22px;
  color: #94a3b8;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.hiclient-channel-item:hover .hiclient-external-icon {
  color: #667eea;
  transform: translateX(4px) rotate(15deg);
}

.hiclient-empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
}

.hiclient-empty-icon {
  font-size: 48px;
  margin: 0 auto 24px;
  opacity: 0.4;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hiclient-empty-state p {
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .hiclient-modal-content {
    padding: 24px;
    border-radius: 20px;
    width: 95%;
    max-height: 90vh;
  }
  
  .hiclient-modal-header {
    font-size: 24px;
    padding-right: 50px;
  }
  
  .hiclient-channel-item {
    padding: 16px;
    gap: 14px;
  }
  
  .hiclient-channel-icon {
    width: 44px;
    height: 44px;
  }
  
  .hiclient-channel-label {
    font-size: 16px;
  }
  
  .hiclient-channel-value {
    font-size: 13px;
  }
}`,
  
  js: `/* Modern JS */
console.log("Modern widget initialized with greeting:", '{{GREETING_MESSAGE}}');

function initializeWidget() {
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  var channelsContainer = document.querySelector(".hiclient-channels-container");
  var emptyState = document.querySelector(".hiclient-empty-state");
  
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Enhanced empty state handling
  if (channelsContainer && emptyState) {
    var hasChannels = channelsContainer.children.length > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      modal.classList.add("show");
      
      // Enhanced video handling with better error management
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        var playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(function() {
            console.log("Video started successfully");
          }).catch(function(error) {
            console.log("Video autoplay prevented:", error);
            video.muted = true;
            video.play().catch(function(mutedError) {
              console.log("Muted video play failed:", mutedError);
            });
          });
        }
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
    
    // Enhanced modal backdrop click handling
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Enhanced keyboard handling
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }
  
  // Enhanced tooltip handling with better positioning
  if (tooltip && button) {
    if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
      button.addEventListener("mouseenter", function() {
        tooltip.classList.remove("hide");
        tooltip.classList.add("show");
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
  
  // Enhanced channel click handling with animation feedback
  window.openChannel = function(url) {
    var clickedChannel = event.target.closest('.hiclient-channel-item');
    if (clickedChannel) {
      clickedChannel.style.transform = 'scale(0.95)';
      setTimeout(function() {
        clickedChannel.style.transform = '';
      }, 150);
    }
    
    window.open(url, "_blank");
  };
  
  // Add smooth scrolling for channels container
  if (channelsContainer) {
    channelsContainer.style.scrollBehavior = 'smooth';
  }
  
  // Enhanced focus management for accessibility
  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      var focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      var firstElement = focusableElements[0];
      var lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Enhanced initialization with retry mechanism
function tryInitialize(attempts) {
  if (attempts === void 0) { attempts = 3; }
  
  try {
    initializeWidget();
  } catch (error) {
    console.warn("Widget initialization failed, attempts remaining:", attempts - 1);
    if (attempts > 1) {
      setTimeout(function() {
        tryInitialize(attempts - 1);
      }, 100);
    } else {
      console.error("Widget initialization failed after multiple attempts:", error);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() {
    tryInitialize();
  });
} else {
  tryInitialize();
}`
});