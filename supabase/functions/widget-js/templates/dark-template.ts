import type { WidgetTemplate } from '../template-types.ts'

export const getDarkTemplate = (): WidgetTemplate => ({
  id: 'dark',
  name: 'Dark Theme',
  description: 'Modern dark-themed widget with sleek design',
  html: `
<!-- Dark Theme Template -->
<div id="hiclient-widget-container" class="hiclient-dark-theme" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div id="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
  <button id="hiclient-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: {{BUTTON_COLOR}};">
    {{BUTTON_ICON}}
  </button>
</div>

<div id="hiclient-modal-backdrop">
  <div id="hiclient-modal-content">
    <div id="hiclient-modal-header">{{GREETING_MESSAGE}}</div>
    <div id="hiclient-modal-close">×</div>
    {{VIDEO_CONTENT}}
    <div id="hiclient-channels-container">
      <!-- Channels will be dynamically generated -->
    </div>
    <div id="hiclient-empty-state" style="display: none;">
      <div id="hiclient-empty-icon">📞</div>
      <p>No channels configured</p>
    </div>
  </div>
</div>`,
  
  css: `
/* Dark Theme CSS */
.hiclient-dark-theme {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

#hiclient-widget-button {
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

#hiclient-widget-button:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
}

#hiclient-tooltip {
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

#hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

#hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

#hiclient-modal-backdrop {
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

#hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
  display: flex;
}

#hiclient-modal-content {
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

#hiclient-modal-backdrop.show #hiclient-modal-content {
  transform: scale(1) translateY(0);
}

#hiclient-modal-close {
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

#hiclient-modal-close:hover {
  background: #333;
  color: #fff;
}

#hiclient-modal-header {
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

#hiclient-channels-container {
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
  color: white;
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

#hiclient-empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #888;
}

#hiclient-empty-icon {
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
  var channelsContainer = document.getElementById("hiclient-channels-container");
  var emptyState = document.getElementById("hiclient-empty-state");
  
  if (video) {
    video.muted = true;
    video.pause();
    video.currentTime = 0;
  }
  
  // Generate channels HTML
  if (channelsContainer) {
    var channelsData = {{CHANNELS_DATA}};
    var channelsHtml = '';
    
    if (channelsData && channelsData.length > 0) {
      channelsData.forEach(function(channel) {
        var channelUrl = getChannelUrl(channel);
        var channelColor = getChannelColor(channel.type);
        
        channelsHtml += '<a href="' + channelUrl + '" target="_blank" class="hiclient-channel-item" onclick="window.openChannel && window.openChannel(\\''+channelUrl+'\\'); return false;">';
        channelsHtml += '<div class="hiclient-channel-icon" style="background: ' + channelColor + ';">';
        
        if (channel.type === 'custom' && channel.customIcon) {
          channelsHtml += '<img src="' + channel.customIcon + '" style="width: 20px; height: 20px; object-fit: contain;" alt="Custom icon">';
        } else {
          channelsHtml += getChannelIcon(channel.type);
        }
        
        channelsHtml += '</div>';
        channelsHtml += '<div class="hiclient-channel-info">';
        channelsHtml += '<div class="hiclient-channel-label">' + channel.label + '</div>';
        channelsHtml += '<div class="hiclient-channel-value">' + channel.value + '</div>';
        channelsHtml += '</div>';
        channelsHtml += '</a>';
      });
      
      channelsContainer.innerHTML = channelsHtml;
    } else if (emptyState) {
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
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
      });
      
      button.addEventListener("mouseleave", function() {
        tooltip.classList.remove("show");
        tooltip.classList.add("hide");
        setTimeout(function() {
          tooltip.style.display = 'none';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        }, 200);
      });
    } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
      tooltip.style.display = 'block';
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
      tooltip.classList.add("show");
    }
  }
  
  window.openChannel = function(url) {
    window.open(url, "_blank");
  };
  
  // Utility functions
  function getChannelUrl(channel) {
    switch (channel.type) {
      case 'whatsapp':
        return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
      case 'telegram':
        return channel.value.startsWith('@') ? 'https://t.me/' + channel.value.slice(1) : 'https://t.me/' + channel.value;
      case 'email':
        return 'mailto:' + channel.value;
      case 'phone':
        return 'tel:' + channel.value;
      default:
        return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
    }
  }
  
  function getChannelIcon(type) {
    var icons = {
      whatsapp: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/></svg>',
      telegram: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
      email: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
      phone: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
      custom: '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v8a2 2 0 002 2h4v-2H6V8h4V6zM14 6v2h4v8h-4v2h4a2 2 0 002-2V8a2 2 0 00-2-2h-4zM12 11h-2v2h2v-2z"/></svg>'
    };
    return icons[type] || '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  }
  
  function getChannelColor(type) {
    var colors = {
      whatsapp: '#25d366',
      telegram: '#0088cc',
      email: '#ea4335',
      phone: '#22c55e',
      instagram: '#e4405f',
      facebook: '#1877f2',
      twitter: '#1da1f2',
      linkedin: '#0077b5',
      youtube: '#ff0000',
      github: '#333333',
      tiktok: '#ff0050',
      messenger: '#0084ff',
      viber: '#665cac',
      skype: '#00aff0',
      discord: '#5865f2',
      website: '#6b7280',
      chatbot: '#8b5cf6',
      custom: '#6b7280'
    };
    return colors[type] || '#6B7280';
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}`
});