
import type { WidgetTemplate } from './template-types.ts'
import { defaultHtmlTemplate } from './templates/default/html-template.ts'
import { defaultCssStyles } from './templates/default/css-styles.ts'
import { getChannelUrl, getChannelIcon, getChannelColor } from './templates/default/utility-functions.ts'

// JavaScript logic with live chat functionality
const defaultJavaScriptLogic = `
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

  function getChannelIcon(channel) {
    var icons = {
      whatsapp: '<img src="/social-icons/007-social.png" alt="Whatsapp" className="w-8 h-8" />',
      telegram: '<img src="/social-icons/006-telegram.png" alt="Telegram" className="w-8 h-8" />',
      instagram: '<img src="/social-icons/002-instagram.png" alt="Instagram" className="w-8 h-8" />',
      messenger: '<img src="/social-icons/018-messenger.png" alt="Messenger" className="w-8 h-8" />',
      viber: '<img src="/social-icons/011-viber.png" alt="Viber" className="w-8 h-8" />',
      discord: '<img src="/social-icons/017-discord.png" alt="Discord" className="w-8 h-8" />',
      tiktok: '<img src="/social-icons/004-tiktok.png" alt="Tiktok" className="w-8 h-8" />',
      youtube: '<img src="/social-icons/008-youtube.png" alt="Youtube" className="w-8 h-8" />',
      facebook: '<img src="/social-icons/003-facebook.png" alt="Facebook" className="w-8 h-8" />',
      twitter: '<img src="/social-icons/twitter.png" alt="X" className="w-8 h-8" />',
      linkedin: '<img src="/social-icons/005-linkedin.png" alt="Linkedin" className="w-8 h-8" />',
      github: '<img src="/social-icons/012-github.png" alt="Github" className="w-8 h-8" />',
      behance: '<img src="/social-icons/014-behance.png" alt="Behance" className="w-8 h-8" />',
      dribble: '<img src="/social-icons/013-dribble.png" alt="Dribble" className="w-8 h-8" />',
      figma: '<img src="/social-icons/016-figma.png" alt="Figma" className="w-8 h-8" />',
      upwork: '<img src="/social-icons/015-upwork.png" alt="Upwork" className="w-8 h-8" />',
      website: '<img src="/social-icons/internet.png" alt="Website" className="w-8 h-8" />',
      email: '<img src="/social-icons/019-mail.png" alt="Email" className="w-8 h-8" />',
      phone: '<img src="/social-icons/telephone.png" alt="Telephone" className="w-8 h-8" />',
      custom: '<img src="/social-icons/link.png" alt="Link" className="w-8 h-8" />'
    };
    return icons[channel.type] || '🔗';
  }

  function getChannelColor(type) {
    var colors = {
      phone: '#ffffff',
      custom: '#ffffff'
    };
    return colors[type] || '#ffffff';
  }
  
  console.log('Widget loading with channels:', {{CHANNELS_DATA}});
  console.log('Live chat enabled:', {{LIVE_CHAT_ENABLED}});
  
  var channelsData = {{CHANNELS_DATA}};
  var liveChatEnabled = {{LIVE_CHAT_ENABLED}};
  var liveChatConfig = {
    agentName: '{{LIVE_CHAT_AGENT_NAME}}',
    greeting: '{{LIVE_CHAT_GREETING}}',
    color: '{{LIVE_CHAT_COLOR}}',
    autoOpen: {{LIVE_CHAT_AUTO_OPEN}},
    offlineMessage: '{{LIVE_CHAT_OFFLINE_MESSAGE}}'
  };
  
  function openChannel(url) {
    window.open(url, '_blank');
  }
  
  function openLiveChat() {
    var modal = document.querySelector('#lovable-widget-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      
      var modalContent = document.querySelector('#lovable-modal-content');
      if (modalContent) {
        setTimeout(function() {
          modalContent.style.transform = 'translateY(0)';
        }, 50);
      }
      
      // Switch to live chat view
      showLiveChatInterface();
    }
  }
  
  function showLiveChatInterface() {
    var channelsContainer = document.querySelector('#lovable-widget-channels');
    var liveChatContainer = document.querySelector('#lovable-live-chat-container');
    
    if (channelsContainer) channelsContainer.style.display = 'none';
    if (liveChatContainer) {
      liveChatContainer.style.display = 'block';
      // Focus on the message input
      var messageInput = liveChatContainer.querySelector('#live-chat-message');
      if (messageInput) messageInput.focus();
    }
  }
  
  function showChannels() {
    var channelsContainer = document.querySelector('#lovable-widget-channels');
    var liveChatContainer = document.querySelector('#lovable-live-chat-container');
    
    if (channelsContainer) channelsContainer.style.display = 'block';
    if (liveChatContainer) liveChatContainer.style.display = 'none';
  }
  
  function sendLiveChatMessage() {
    var nameInput = document.querySelector('#live-chat-name');
    var emailInput = document.querySelector('#live-chat-email');
    var messageInput = document.querySelector('#live-chat-message');
    var sendButton = document.querySelector('#live-chat-send-btn');
    
    if (!nameInput || !messageInput) return;
    
    var name = nameInput.value.trim();
    var email = emailInput ? emailInput.value.trim() : '';
    var message = messageInput.value.trim();
    
    if (!name || !message) {
      alert('Please enter your name and message');
      return;
    }
    
    if (sendButton) sendButton.disabled = true;
    
    // Here you would normally send the message to your backend
    // For now, we'll just show a success message
    var messagesContainer = document.querySelector('#live-chat-messages');
    if (messagesContainer) {
      var messageElement = document.createElement('div');
      messageElement.className = 'live-chat-message user-message';
      messageElement.innerHTML = '<strong>You:</strong> ' + escapeHtml(message);
      messagesContainer.appendChild(messageElement);
      
      // Simulate agent response
      setTimeout(function() {
        var agentMessage = document.createElement('div');
        agentMessage.className = 'live-chat-message agent-message';
        agentMessage.innerHTML = '<strong>' + escapeHtml(liveChatConfig.agentName) + ':</strong> Thank you for your message! We will get back to you soon.';
        messagesContainer.appendChild(agentMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 1000);
    }
    
    // Clear the message input
    messageInput.value = '';
    if (sendButton) sendButton.disabled = false;
    
    // Scroll to bottom
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
  
  function toggleDropdown(dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    var arrow = document.querySelector('[data-dropdown="' + dropdownId + '"]');
    
    if (!dropdown || !arrow) return;
    
    var allDropdowns = document.querySelectorAll('.dropdown');
    var allArrows = document.querySelectorAll('.dropdown-arrow');
    
    allDropdowns.forEach(function(d) {
      if (d.id !== dropdownId) {
        d.classList.remove('show');
      }
    });
    
    allArrows.forEach(function(a) {
      if (a !== arrow) {
        a.classList.remove('rotated');
      }
    });
    
    dropdown.classList.toggle('show');
    arrow.classList.toggle('rotated');
  }
  
  function generateChannelsHtml() {
    if (!channelsData || channelsData.length === 0) {
      var emptyState = document.querySelector('.lovable-empty-state');
      if (emptyState) {
        emptyState.style.display = 'block';
      }
      return '';
    }
    
    var html = '';
    
    // Add live chat option if enabled
    if (liveChatEnabled) {
      html += '<div class="channel-item live-chat-channel" onclick="openLiveChat()" style="cursor: pointer; background: linear-gradient(135deg, ' + liveChatConfig.color + ', ' + adjustColorBrightness(liveChatConfig.color, -20) + '); color: white; border: none;">';
      html += '<div class="channel-icon" style="background: rgba(255, 255, 255, 0.2);">💬</div>';
      html += '<div class="channel-info">';
      html += '<div class="channel-label">Live Chat</div>';
      html += '<div class="channel-value">Chat with ' + escapeHtml(liveChatConfig.agentName) + '</div>';
      html += '</div>';
      html += '<div class="channel-arrow">→</div>';
      html += '</div>';
    }
    
    for (var i = 0; i < channelsData.length; i++) {
      var channel = channelsData[i];
      var channelUrl = getChannelUrl(channel);
      var channelIcon = getChannelIcon(channel);
      var channelColor = getChannelColor(channel.type);
      
      if (channel.childChannels && channel.childChannels.length > 0) {
        var dropdownId = 'dropdown-' + channel.id;
        
        html += '<div class="parent-channel-wrapper">';
        html += '<div style="display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 12px; background: white; transition: all 0.3s ease;">';
        
        // Changed to a div instead of an anchor to prevent direct navigation
        html += '<div class="parent-channel" style="border: none; margin: 0; flex: 1; cursor: pointer;" onclick="toggleDropdown(' + "'" + dropdownId + "'" + ')">';
        html += '<div class="channel-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + escapeHtml(channel.label) + '</div>';
        html += '<div class="channel-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '</div>';
        
        html += '<button class="dropdown-toggle" onclick="toggleDropdown(' + "'" + dropdownId + "'" + ')">';
        html += '<svg class="dropdown-arrow" data-dropdown="' + dropdownId + '" viewBox="0 0 24 24" fill="currentColor">';
        html += '<path d="M7 10l5 5 5-5z"/>';
        html += '</svg>';
        html += '</button>';
        html += '<div class="child-count">' + (channel.childChannels.length + 1) + '</div>';
        html += '</div>';
        html += '<div class="dropdown" id="' + dropdownId + '">';
        
        // Add the parent channel as the first item in the dropdown
        html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="dropdown-item">';
        html += '<div class="dropdown-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="dropdown-info">';
        html += '<div class="dropdown-label">' + escapeHtml(channel.label) + ' (Primary)</div>';
        html += '<div class="dropdown-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '</a>';
        
        for (var j = 0; j < channel.childChannels.length; j++) {
          var childChannel = channel.childChannels[j];
          var childUrl = getChannelUrl(childChannel);
          var childIcon = getChannelIcon(childChannel);
          var childColor = getChannelColor(childChannel.type);
          
          html += '<a href="' + escapeHtml(childUrl) + '" target="_blank" class="dropdown-item">';
          html += '<div class="dropdown-icon" style="background: ' + childColor + ';">' + childIcon + '</div>';
          html += '<div class="dropdown-info">';
          html += '<div class="dropdown-label">' + escapeHtml(childChannel.label) + '</div>';
          html += '<div class="dropdown-value">' + escapeHtml(childChannel.value) + '</div>';
          html += '</div>';
          html += '</a>';
        }
        
        html += '</div>';
        html += '</div>';
      } else {
        html += '<a href="' + escapeHtml(channelUrl) + '" target="_blank" class="channel-item">';
        html += '<div class="channel-icon" style="background: ' + channelColor + ';">' + channelIcon + '</div>';
        html += '<div class="channel-info">';
        html += '<div class="channel-label">' + escapeHtml(channel.label) + '</div>';
        html += '<div class="channel-value">' + escapeHtml(channel.value) + '</div>';
        html += '</div>';
        html += '<div class="channel-arrow">→</div>';
        html += '</a>';
      }
    }
    
    return html;
  }
  
  function adjustColorBrightness(color, amount) {
    var num = parseInt(color.replace("#",""),16);
    var amt = Math.round((255 * amount) / 100);
    
    var r = (num >> 16) + amt;
    var g = (num >> 8 & 0x00FF) + amt;
    var b = (num & 0x0000FF) + amt;
    
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return "#" + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  }
  
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  function playVideo() {
    try {
      console.log('playVideo function called');
      var videos = document.querySelectorAll('.hiclient-video-player');
      console.log('Found videos:', videos.length);
      
      if (videos.length > 0) {
        videos.forEach(function(video, index) {
          console.log('Processing video', index, 'with src:', video.src);
          
          if (video.tagName === 'VIDEO') {
            // Handle HTML5 video elements
            if (video.src && video.src !== '') {
              video.currentTime = 0;
              // Enable sound for video playback
              
              var playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.then(function() {
                  console.log('Video', index, 'started playing successfully with sound');
                }).catch(function(error) {
                  console.log('Video', index, 'autoplay failed:', error);
                  // Force play after small delay
                  setTimeout(function() {
                    try {
                      video.play().then(function() {
                        console.log('Video', index, 'started on retry with sound');
                      }).catch(function(retryError) {
                        console.log('Video', index, 'retry failed:', retryError);
                      });
                    } catch (e) {
                      console.log('Video', index, 'retry exception:', e);
                    }
                  }, 500);
                });
              }
            } else {
              console.log('Video', index, 'has no valid src');
            }
          } else if (video.tagName === 'IFRAME') {
            // Handle YouTube iframe videos
            console.log('Processing YouTube iframe', index);
            var currentSrc = video.src;
            // Add autoplay parameter to YouTube iframe when modal opens
            if (currentSrc && !currentSrc.includes('autoplay=1')) {
              var separator = currentSrc.includes('?') ? '&' : '?';
              video.src = currentSrc + separator + 'autoplay=1';
              console.log('YouTube iframe', index, 'autoplay enabled');
            }
          }
        });
      } else {
        console.log('No video elements found with class hiclient-video-player');
      }
    } catch (error) {
      console.log('Error in playVideo function:', error);
    }
  }
  
  function initWidget() {
    console.log('Initializing widget...');
    
    var channelsContainer = document.querySelector('#lovable-widget-channels');
    if (channelsContainer) {
      var generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
      console.log('Channels HTML generated and inserted');
    }
    
    // Initialize live chat interface
    if (liveChatEnabled) {
      var liveChatContainer = document.querySelector('#lovable-live-chat-container');
      if (liveChatContainer) {
        liveChatContainer.innerHTML = generateLiveChatHtml();
        
        // Set up live chat event listeners
        var sendBtn = document.querySelector('#live-chat-send-btn');
        var messageInput = document.querySelector('#live-chat-message');
        var backBtn = document.querySelector('#live-chat-back-btn');
        
        if (sendBtn) {
          sendBtn.addEventListener('click', sendLiveChatMessage);
        }
        
        if (messageInput) {
          messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendLiveChatMessage();
            }
          });
        }
        
        if (backBtn) {
          backBtn.addEventListener('click', showChannels);
        }
      }
    }
    
    var button = document.querySelector('#lovable-widget-button');
    var modal = document.querySelector('#lovable-widget-modal');
    var modalContent = document.querySelector('#lovable-modal-content');
    var tooltip = document.querySelector('#lovable-widget-tooltip');
    var closeBtn = document.querySelector('#lovable-widget-close');
    
    if (!button || !modal) {
      console.error('Missing widget elements:', { button: !!button, modal: !!modal });
      return;
    }
    
    console.log('Widget elements found:', { button: !!button, modal: !!modal, closeBtn: !!closeBtn });
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Button clicked, showing modal');
      modal.style.display = 'flex';
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      
      if (modalContent) {
        setTimeout(function() {
          modalContent.style.transform = 'translateY(0)';
        }, 50);
      }
      
      // Auto-open live chat if enabled
      if (liveChatEnabled && liveChatConfig.autoOpen) {
        setTimeout(function() {
          showLiveChatInterface();
        }, 300);
      }
      
      // Start video playback when modal opens - with delay to ensure DOM is ready
      setTimeout(function() {
        console.log('Attempting to play video after modal open');
        playVideo();
      }, 300);
    });
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked');
        closeModal();
      });
    }
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        console.log('Modal backdrop clicked');
        closeModal();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        console.log('ESC key pressed');
        closeModal();
      }
    });
    
    function closeModal() {
      // Pause all videos when modal closes and reset YouTube iframes
      try {
        var videos = document.querySelectorAll('.hiclient-video-player');
        videos.forEach(function(video) {
          if (video.tagName === 'VIDEO' && !video.paused) {
            video.pause();
            console.log('Video paused');
          } else if (video.tagName === 'IFRAME') {
            // Remove autoplay from YouTube iframe when modal closes
            var currentSrc = video.src;
            if (currentSrc && currentSrc.includes('autoplay=1')) {
              video.src = currentSrc.replace(/[?&]autoplay=1/, '').replace(/autoplay=1[&]?/, '');
              console.log('YouTube iframe autoplay disabled');
            }
          }
        });
      } catch (error) {
        console.log('Error pausing videos:', error);
      }
      
      if (modalContent) {
        modalContent.style.transform = 'translateY(20px)';
      }
      
      setTimeout(function() {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        
        // Reset to channels view
        showChannels();
        
        var allDropdowns = document.querySelectorAll('.dropdown');
        var allArrows = document.querySelectorAll('.dropdown-arrow');
        allDropdowns.forEach(function(dropdown) {
          dropdown.classList.remove('show');
        });
        allArrows.forEach(function(arrow) {
          arrow.classList.remove('rotated');
        });
      }, 100);
    }
    
    if (tooltip && button) {
      if ('{{TOOLTIP_DISPLAY}}' === 'hover') {
        button.addEventListener('mouseenter', function() {
          tooltip.style.display = 'block';
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', function() {
          tooltip.style.display = 'none';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });
      } else if ('{{TOOLTIP_DISPLAY}}' === 'always') {
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
      }
    }
    
    console.log('Widget initialized successfully');
    
    // Only preload video metadata on widget init, do NOT start playing
    setTimeout(function() {
      var videos = document.querySelectorAll('.hiclient-video-player');
      if (videos.length > 0) {
        console.log('Preloading', videos.length, 'videos metadata');
        videos.forEach(function(video) {
          if (video.tagName === 'VIDEO') {
            video.preload = 'metadata'; // Only preload metadata, not full video
          }
        });
      }
    }, 100);
  }
  
  function generateLiveChatHtml() {
    return '<div class="live-chat-interface" style="display: none;">' +
      '<div class="live-chat-header" style="padding: 15px; background: ' + liveChatConfig.color + '; color: white; border-radius: 15px 15px 0 0; display: flex; align-items: center; justify-content: space-between;">' +
        '<div style="display: flex; align-items: center; gap: 10px;">' +
          '<button id="live-chat-back-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">←</button>' +
          '<div>' +
            '<div style="font-weight: bold;">' + escapeHtml(liveChatConfig.agentName) + '</div>' +
            '<div style="font-size: 12px; opacity: 0.8;">Online now</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="live-chat-messages" style="height: 300px; overflow-y: auto; padding: 15px; background: #f8f9fa;">' +
        '<div class="live-chat-message agent-message" style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' +
          '<strong>' + escapeHtml(liveChatConfig.agentName) + ':</strong> ' + escapeHtml(liveChatConfig.greeting) +
        '</div>' +
      '</div>' +
      '<div class="live-chat-input" style="padding: 15px; background: white; border-top: 1px solid #e9ecef;">' +
        '<div style="margin-bottom: 10px;">' +
          '<input type="text" id="live-chat-name" placeholder="Your name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 8px;" required>' +
          '<input type="email" id="live-chat-email" placeholder="Your email (optional)" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">' +
        '</div>' +
        '<div style="display: flex; gap: 10px;">' +
          '<textarea id="live-chat-message" placeholder="Type your message..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical; min-height: 40px;" required></textarea>' +
          '<button id="live-chat-send-btn" style="background: ' + liveChatConfig.color + '; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Send</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  
  window.refreshWidget = function() {
    var channelsContainer = document.querySelector('#lovable-widget-channels');
    if (channelsContainer) {
      var generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
    }
  };
  
  window.openChannel = openChannel;
  window.openLiveChat = openLiveChat;
  window.toggleDropdown = toggleDropdown;
  window.playVideo = playVideo;
  window.sendLiveChatMessage = sendLiveChatMessage;
  window.showChannels = showChannels;
  window.showLiveChatInterface = showLiveChatInterface;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    setTimeout(initWidget, 100);
  }
`;

export const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Modern Clean Template', 
  description: 'Modern and clean floating widget with green accent and live chat support',
  html: defaultHtmlTemplate,
  css: defaultCssStyles,
  js: defaultJavaScriptLogic
};

export const getDefaultTemplate = () => defaultTemplate;
