import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Ultra Modern Glassmorphism',
  description: 'Cutting-edge template with glassmorphism, 3D effects and fluid animations',
  html: `
<!-- Ultra Modern Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 24px; z-index: 99999;">
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">
    <span class="tooltip-text">{{TOOLTIP_TEXT}}</span>
    <div class="tooltip-arrow"></div>
  </div>
  <div class="hiclient-widget-wrapper">
    <div class="widget-glow"></div>
    <button class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px;">
      <div class="button-inner">
        <div class="button-ripple"></div>
        <div class="button-icon">{{BUTTON_ICON}}</div>
        <div class="button-pulse"></div>
      </div>
    </button>
  </div>
</div>

<div class="hiclient-modal-backdrop">
  <div class="modal-particles"></div>
  <div class="hiclient-modal-content">
    <div class="modal-glass-bg"></div>
    <div class="modal-content-inner">
      <div class="hiclient-modal-header">
        <div class="header-gradient">{{GREETING_MESSAGE}}</div>
        <div class="header-subtitle">Choose your preferred contact method</div>
      </div>
      <div class="hiclient-modal-close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      {{VIDEO_CONTENT}}
      <div class="hiclient-channels-container">
        {{CHANNELS_HTML}}
      </div>
      <div class="hiclient-empty-state" style="display: none;">
        <div class="empty-icon-wrapper">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8.5 14.5L16 8M8.5 8l7.5 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <h3>No Contact Methods</h3>
        <p>Configure your contact channels to get started</p>
      </div>
    </div>
  </div>
</div>`,
  
  css: `
/* Ultra Modern Glassmorphism CSS */
.hiclient-widget-container {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-feature-settings: 'ss01', 'ss02', 'cv01', 'cv03';
}

.hiclient-widget-wrapper {
  position: relative;
  display: inline-block;
}

.widget-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: conic-gradient(from 0deg at 50% 50%, 
    #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe, #667eea);
  border-radius: 50%;
  opacity: 0;
  animation: rotateGlow 3s linear infinite;
  transition: opacity 0.3s ease;
  z-index: -1;
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: relative;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.25) 0%, 
    rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  overflow: hidden;
}

.button-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, {{BUTTON_COLOR}}, #667eea);
  background-size: 200% 200%;
  animation: gradientShift 4s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.button-icon {
  position: relative;
  z-index: 3;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
  pointer-events: none;
}

.button-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, {{BUTTON_COLOR}}, #667eea);
  opacity: 0;
  animation: pulse 2s ease-in-out infinite;
  z-index: -1;
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0;
    transform: scale(1);
  }
  50% { 
    opacity: 0.3;
    transform: scale(1.1);
  }
}

.hiclient-widget-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 12px 40px rgba(102, 126, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.hiclient-widget-button:hover .widget-glow {
  opacity: 0.6;
}

.hiclient-widget-button:hover .button-icon {
  transform: scale(1.1);
}

.hiclient-widget-button:active .button-ripple {
  width: 100%;
  height: 100%;
}

.hiclient-tooltip {
  position: absolute;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(16px) saturate(200%);
  -webkit-backdrop-filter: blur(16px) saturate(200%);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  pointer-events: none;
}

.tooltip-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
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
  background: radial-gradient(ellipse at center, 
    rgba(102, 126, 234, 0.15) 0%, 
    rgba(0, 0, 0, 0.8) 70%);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.modal-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(102, 126, 234, 0.2), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(118, 75, 162, 0.2), transparent);
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: floatParticles 20s linear infinite;
  pointer-events: none;
}

@keyframes floatParticles {
  0% { transform: translateY(0); }
  100% { transform: translateY(-200px); }
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  position: relative;
  max-width: 480px;
  width: 90%;
  max-height: 85vh;
  overflow: hidden;
  border-radius: 24px;
  transform: scale(0.8) translateY(40px);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.modal-glass-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.25) 0%, 
    rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  z-index: 1;
}

.modal-content-inner {
  position: relative;
  z-index: 2;
  padding: 40px;
  height: 100%;
  overflow-y: auto;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) translateY(0);
}

.hiclient-modal-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 10;
}

.hiclient-modal-close:hover {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  transform: rotate(90deg) scale(1.1);
  border-color: rgba(239, 68, 68, 0.5);
}

.hiclient-modal-header {
  margin: 0 0 32px 0;
  text-align: center;
  padding-right: 60px;
}

.header-gradient {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  margin-bottom: 8px;
  animation: gradientText 3s ease-in-out infinite;
}

@keyframes gradientText {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.header-subtitle {
  font-size: 15px;
  color: rgba(100, 116, 139, 0.8);
  font-weight: 500;
  letter-spacing: 0.025em;
}

.hiclient-video-container {
  margin-bottom: 32px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 
    0 16px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.hiclient-channels-container {
  max-height: 400px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding-right: 4px;
}

.hiclient-channels-container::-webkit-scrollbar {
  width: 6px;
}

.hiclient-channels-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.hiclient-channels-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.hiclient-channel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(102, 126, 234, 0.1), 
    transparent);
  transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.hiclient-channel-item:hover::before {
  left: 100%;
}

.hiclient-channel-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.4);
  box-shadow: 
    0 16px 48px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.hiclient-channel-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.hiclient-channel-item:hover .hiclient-channel-icon {
  transform: scale(1.1) rotate(5deg);
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 700;
  font-size: 17px;
  color: #1e293b;
  margin: 0 0 6px 0;
  line-height: 1.3;
  letter-spacing: -0.025em;
}

.hiclient-channel-value {
  font-size: 14px;
  color: rgba(100, 116, 139, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
}

.hiclient-external-icon {
  width: 24px;
  height: 24px;
  color: rgba(148, 163, 184, 0.6);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.hiclient-channel-item:hover .hiclient-external-icon {
  color: #667eea;
  transform: translateX(4px) rotate(15deg);
}

.hiclient-empty-state {
  text-align: center;
  padding: 80px 20px;
  color: rgba(100, 116, 139, 0.6);
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  opacity: 0.4;
  color: #667eea;
}

.hiclient-empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;
}

.hiclient-empty-state p {
  font-size: 15px;
  color: rgba(100, 116, 139, 0.7);
  margin: 0;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 480px) {
  .hiclient-modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-content-inner {
    padding: 32px 24px;
  }
  
  .header-gradient {
    font-size: 24px;
  }
  
  .hiclient-channel-item {
    padding: 16px;
    gap: 16px;
  }
  
  .hiclient-channel-icon {
    width: 48px;
    height: 48px;
  }
}`,
  
  js: `/* Ultra Modern Widget JS */
console.log("Ultra Modern widget initialized with greeting:", '{{GREETING_MESSAGE}}');

function initializeWidget() {
  const button = document.querySelector(".hiclient-widget-button");
  const modal = document.querySelector(".hiclient-modal-backdrop");
  const tooltip = document.querySelector(".hiclient-tooltip");
  const closeBtn = document.querySelector(".hiclient-modal-close");
  const video = document.querySelector(".hiclient-video-player");
  const channelsContainer = document.querySelector(".hiclient-channels-container");
  const emptyState = document.querySelector(".hiclient-empty-state");
  const ripple = document.querySelector(".button-ripple");
  
  // Initialize video
  if (video) {
    video.muted = true;
    video.pause();
    
    // Add loading and error handling
    video.addEventListener('loadstart', () => {
      console.log('Video loading started');
    });
    
    video.addEventListener('error', (e) => {
      console.warn('Video error:', e);
    });
  }
  
  // Show/hide empty state
  if (channelsContainer && emptyState) {
    const hasChannels = channelsContainer.children.length > 0;
    emptyState.style.display = hasChannels ? 'none' : 'block';
  }
  
  // Enhanced button interactions
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Add haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      modal.classList.add("show");
      document.body.style.overflow = 'hidden';
      
      // Play video with better error handling
      if (video) {
        video.muted = false;
        video.currentTime = 0;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video playing successfully');
            })
            .catch((error) => {
              console.warn("Video autoplay prevented:", error);
              video.muted = true;
              video.play();
            });
        }
      }
    });
    
    // Enhanced close functionality
    function closeModal() {
      modal.classList.remove("show");
      document.body.style.overflow = '';
      
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
    
    // Click outside to close
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
    
    // Ripple effect
    if (ripple) {
      button.addEventListener("mousedown", function(e) {
        ripple.style.width = "0";
        ripple.style.height = "0";
        
        setTimeout(() => {
          ripple.style.width = "100%";
          ripple.style.height = "100%";
        }, 10);
      });
      
      button.addEventListener("mouseup", function() {
        setTimeout(() => {
          ripple.style.width = "0";
          ripple.style.height = "0";
        }, 300);
      });
    }
  }
  
  // Enhanced tooltip functionality
  if (tooltip && button) {
    const tooltipDisplay = '{{TOOLTIP_DISPLAY}}';
    
    if (tooltipDisplay === 'hover') {
      let hoverTimeout;
      
      button.addEventListener("mouseenter", function() {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          tooltip.classList.add("show");
          tooltip.classList.remove("hide");
        }, 300);
      });
      
      button.addEventListener("mouseleave", function() {
        clearTimeout(hoverTimeout);
        tooltip.classList.remove("show");
        tooltip.classList.add("hide");
        
        setTimeout(() => {
          tooltip.classList.remove("hide");
        }, 300);
      });
    } else if (tooltipDisplay === 'always') {
      tooltip.style.display = 'block';
      tooltip.classList.add("show");
    }
  }
  
  // Enhanced channel interactions
  document.querySelectorAll('.hiclient-channel-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Global channel opener with analytics
  window.openChannel = function(url, channelName) {
    console.log(\`Opening channel: \${channelName || 'Unknown'} - \${url}\`);
    
    // Add slight delay for better UX
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 150);
  };
  
  // Intersection Observer for animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.hiclient-channel-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(item);
    });
  }
  
  // Performance monitoring
  if ('performance' in window) {
    const loadTime = performance.now();
    console.log(\`Widget initialized in \${loadTime.toFixed(2)}ms\`);
  }
}

// Enhanced initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  // Use requestAnimationFrame for smoother initialization
  requestAnimationFrame(initializeWidget);
}`
});