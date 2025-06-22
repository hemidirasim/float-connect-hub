import type { WidgetTemplate } from '../template-types.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Gradient',
  description: 'Modern template with gradient effects and smooth animations',
  html: `
<!-- Minimalist Template -->
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 24px; z-index: 99999;">
  
  <!-- Contact Cards Container (Hidden by default) -->
  <div class="hiclient-contacts-preview" style="{{TOOLTIP_POSITION_STYLE}}">
    {{CHANNELS_HTML}}
  </div>
  
  <!-- Main Button -->
  <div class="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px;">
    <div class="hiclient-button-content">
      {{BUTTON_ICON}}
    </div>
    <div class="hiclient-button-ripple"></div>
  </div>
  
  <!-- Tooltip -->
  <div class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">
    {{TOOLTIP_TEXT}}
  </div>
</div>

<!-- Modal -->
<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <button class="hiclient-modal-close" aria-label="Close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m18 6-12 12M6 6l12 12"/>
      </svg>
    </button>
    
    <div class="hiclient-modal-header">
      {{GREETING_MESSAGE}}
    </div>
    
    {{VIDEO_CONTENT}}
    
    <div class="hiclient-channels-grid">
      {{CHANNELS_HTML}}
    </div>
    
    <div class="hiclient-empty-state" style="display: none;">
      <div class="hiclient-empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </div>
      <p>No contacts available</p>
    </div>
  </div>
</div>`,

  css: `
/* Minimalist Clean CSS */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  user-select: none;
}

/* Main Button */
.hiclient-widget-button {
  width: {{BUTTON_SIZE}}px;
  height: {{BUTTON_SIZE}}px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hiclient-button-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 2;
  transition: transform 0.2s ease;
}

.hiclient-button-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.hiclient-widget-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.hiclient-widget-button:hover .hiclient-button-ripple {
  opacity: 1;
  transform: scale(1);
}

.hiclient-widget-button:active {
  transform: scale(0.95);
}

/* Contact Preview Cards */
.hiclient-contacts-preview {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.hiclient-widget-container:hover .hiclient-contacts-preview {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: all;
}

.hiclient-contacts-preview .hiclient-channel-item {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: white;
}

.hiclient-contacts-preview .hiclient-channel-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-2px);
}

.hiclient-contacts-preview .hiclient-channel-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.hiclient-contacts-preview .hiclient-channel-label {
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tooltip */
.hiclient-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100001;
  transition: all 0.2s ease;
  pointer-events: none;
  font-weight: 400;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
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
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
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
  color: #666;
  border: none;
  background: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.hiclient-modal-close:hover {
  background: #f5f5f5;
  color: #000;
}

.hiclient-modal-header {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #000;
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

.hiclient-channels-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.hiclient-channels-grid .hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
  background: white;
}

.hiclient-channels-grid .hiclient-channel-item:hover {
  background: #f9f9f9;
  border-color: #000;
  transform: translateY(-1px);
}

.hiclient-channels-grid .hiclient-channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 500;
  font-size: 14px;
  color: #000;
  margin: 0 0 2px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
}

.hiclient-external-icon {
  width: 16px;
  height: 16px;
  color: #999;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.hiclient-channels-grid .hiclient-channel-item:hover .hiclient-external-icon {
  color: #000;
}

.hiclient-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.hiclient-empty-icon {
  margin: 0 auto 16px;
  opacity: 0.5;
}

.hiclient-empty-state p {
  margin: 0;
  font-size: 14px;
}`,

  js: `/* Minimalist JS */
console.log("Minimalist widget initialized");

function initializeWidget() {
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  var channelsContainer = document.querySelector(".hiclient-channels-grid");
  var emptyState = document.querySelector(".hiclient-empty-state");
  var contactsPreview = document.querySelector(".hiclient-contacts-preview");
  
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Show/hide empty state
  if (channelsContainer && emptyState) {
    var hasChannels = channelsContainer.children.length > 0;
    if (!hasChannels) {
      emptyState.style.display = 'block';
    }
  }
  
  // Hide contacts preview if no channels
  if (contactsPreview && channelsContainer) {
    var hasChannels = channelsContainer.children.length === 0;
    if (hasChannels) {
      contactsPreview.style.display = 'none';
    }
  }
  
  if (button && modal) {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      modal.classList.add("show");
      
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