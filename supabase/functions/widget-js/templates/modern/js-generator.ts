
export function generateModernJavaScript(): string {
  return `
console.log("Modern template JavaScript loading...");

// Platform configuration
var platformConfig = {
  whatsapp: { icon: '💬', color: '#25d366', name: 'WhatsApp' },
  telegram: { icon: '✈️', color: '#0088cc', name: 'Telegram' },
  instagram: { icon: '📸', color: '#e4405f', name: 'Instagram' },
  messenger: { icon: '💬', color: '#006aff', name: 'Messenger' },
  viber: { icon: '📞', color: '#665cac', name: 'Viber' },
  skype: { icon: '📹', color: '#00aff0', name: 'Skype' },
  discord: { icon: '🎮', color: '#7289da', name: 'Discord' },
  tiktok: { icon: '🎵', color: '#000000', name: 'TikTok' },
  youtube: { icon: '📺', color: '#ff0000', name: 'YouTube' },
  facebook: { icon: '👥', color: '#1877f2', name: 'Facebook' },
  twitter: { icon: '🐦', color: '#1da1f2', name: 'Twitter' },
  linkedin: { icon: '💼', color: '#0077b5', name: 'LinkedIn' },
  github: { icon: '💻', color: '#333333', name: 'GitHub' },
  website: { icon: '🌐', color: '#6b7280', name: 'Website' },
  chatbot: { icon: '🤖', color: '#3b82f6', name: 'Chatbot' },
  email: { icon: '✉️', color: '#ea4335', name: 'Email' },
  phone: { icon: '📞', color: '#34d399', name: 'Telefon' },
  custom: { icon: '🔗', color: '#6b7280', name: 'Custom' }
};

function getPlatformConfig(type) {
  return platformConfig[type] || platformConfig.custom;
}

// Channel URL generation
function generateChannelUrl(channel) {
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

// Generate channels HTML with proper structure
function generateChannelsHtml(channels) {
  if (!channels || channels.length === 0) {
    return '<div class="hiclient-empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><p>Heç bir əlaqə mövcud deyil</p></div>';
  }

  var mainChannels = channels.filter(function(ch) { return !ch.parentId; });
  
  return mainChannels.map(function(channel) {
    var platform = getPlatformConfig(channel.type);
    var hasChildren = channel.childChannels && channel.childChannels.length > 0;
    
    if (hasChildren) {
      // Generate hover dropdown for group
      var childrenHtml = [channel].concat(channel.childChannels).map(function(childChannel) {
        var childPlatform = getPlatformConfig(childChannel.type);
        var childUrl = generateChannelUrl(childChannel);
        return '<a href="' + childUrl + '" target="_blank" class="hiclient-group-item" onclick="window.openChannel && window.openChannel(\\'' + childUrl + '\\')"><div class="hiclient-group-item-icon" style="background: ' + childPlatform.color + ';">' + childPlatform.icon + '</div><div class="hiclient-group-item-info"><div class="hiclient-group-item-label">' + childChannel.label + '</div><div class="hiclient-group-item-value">' + childChannel.value + '</div></div></a>';
      }).join('');
      
      var mainUrl = generateChannelUrl(channel);
      return '<div class="hiclient-channel-group"><a href="' + mainUrl + '" target="_blank" class="hiclient-channel-item hiclient-group-trigger" onclick="window.openChannel && window.openChannel(\\'' + mainUrl + '\\')"><div class="hiclient-channel-icon" style="background: ' + platform.color + ';">' + platform.icon + '</div><div class="hiclient-channel-info"><div class="hiclient-channel-label">' + channel.label + '</div><div class="hiclient-channel-value">' + (channel.childChannels.length + 1) + ' seçim</div></div></a><div class="hiclient-group-dropdown">' + childrenHtml + '</div></div>';
    } else {
      // Regular individual channel
      var channelUrl = generateChannelUrl(channel);
      return '<a href="' + channelUrl + '" target="_blank" class="hiclient-channel-item" onclick="window.openChannel && window.openChannel(\\'' + channelUrl + '\\')"><div class="hiclient-channel-icon" style="background: ' + platform.color + ';">' + platform.icon + '</div><div class="hiclient-channel-info"><div class="hiclient-channel-label">' + channel.label + '</div><div class="hiclient-channel-value">' + channel.value + '</div></div><svg class="hiclient-external-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></a>';
    }
  }).join('');
}

// Widget handlers
function initializeTooltip(tooltip, button, config) {
  if (!tooltip || !button) return;
  
  if (config && config.tooltipDisplay === 'hover') {
    button.addEventListener("mouseenter", function() {
      tooltip.classList.add("show");
      tooltip.classList.remove("hide");
      tooltip.style.display = 'block';
    });
    button.addEventListener("mouseleave", function() {
      tooltip.classList.remove("show");
      tooltip.classList.add("hide");
    });
  } else if (config && config.tooltipDisplay === 'always') {
    tooltip.style.display = 'block';
    tooltip.classList.add("show");
  }
}

function initializeModal(button, modal, closeBtn, video) {
  if (!button || !modal) {
    console.error("Modern template: Button or modal not found for initialization");
    return;
  }
  
  console.log("Modern template: Initializing modal event listeners");
  
  button.addEventListener("click", function(e) {
    console.log("Modern template: Button clicked, opening modal");
    e.preventDefault();
    e.stopPropagation();
    modal.classList.add("show");
    document.body.style.overflow = 'hidden';
    
    if (video) {
      video.muted = false;
      video.currentTime = 0;
      video.play().catch(function(error) {
        console.log("Video autoplay blocked:", error);
      });
    }
  });
  
  function closeModal() {
    console.log("Modern template: Closing modal");
    modal.classList.remove("show");
    document.body.style.overflow = '';
    if (video) {
      video.muted = true;
      video.pause();
    }
  }
  
  if (closeBtn) {
    closeBtn.addEventListener("click", function(e) {
      console.log("Modern template: Close button clicked");
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }
  
  modal.addEventListener("click", function(e) {
    if (e.target === modal) {
      console.log("Modern template: Backdrop clicked");
      closeModal();
    }
  });
  
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      console.log("Modern template: Escape key pressed");
      closeModal();
    }
  });
}

function initializeWidget() {
  console.log("Modern template: Starting widget initialization");
  
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  var channelsContainer = document.querySelector("#channels-container");
  var emptyState = document.querySelector(".hiclient-empty-state");
  
  console.log("Modern template: Found elements:", {
    button: !!button,
    modal: !!modal,
    tooltip: !!tooltip,
    closeBtn: !!closeBtn,
    video: !!video,
    channelsContainer: !!channelsContainer,
    emptyState: !!emptyState
  });
  
  // Generate channels HTML
  if (channelsContainer && window.widgetConfig && window.widgetConfig.channels) {
    console.log("Modern template: Generating channels HTML for", window.widgetConfig.channels.length, "channels");
    var channelsHtml = generateChannelsHtml(window.widgetConfig.channels);
    channelsContainer.innerHTML = channelsHtml;
    
    // Show/hide empty state
    if (emptyState) {
      var hasChannels = window.widgetConfig.channels && window.widgetConfig.channels.length > 0;
      emptyState.style.display = hasChannels ? 'none' : 'block';
    }
  }
  
  if (video) {
    video.muted = true;
    video.pause();
  }
  
  // Initialize modal - This is the critical part
  if (button && modal) {
    console.log("Modern template: Initializing modal handlers");
    initializeModal(button, modal, closeBtn, video);
  } else {
    console.error("Modern template: Missing required elements for modal initialization");
  }
  
  // Initialize tooltip
  if (tooltip && button) {
    console.log("Modern template: Initializing tooltip");
    initializeTooltip(tooltip, button, window.widgetConfig);
  }
  
  // Channel opening function
  window.openChannel = function(url) {
    console.log("Modern template: Opening channel URL:", url);
    window.open(url, "_blank");
  };
  
  console.log("Modern template: Widget initialization completed");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  console.log("Modern template: DOM still loading, adding event listener");
  document.addEventListener("DOMContent" + "Loaded", initializeWidget);
} else {
  console.log("Modern template: DOM already loaded, initializing immediately");
  initializeWidget();
}`;
}
