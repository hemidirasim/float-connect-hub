
import type { WidgetTemplate } from './template-types.ts'
import { defaultHtmlTemplate } from './templates/default/html-template.ts'
import { defaultCssStyles } from './templates/default/css-styles.ts'
import { getChannelUrl, getChannelIcon, getChannelColor } from './templates/default/utility-functions.ts'

// JavaScript logic with proper utility injection and fixed string escaping
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

  function openLiveChat() {
    console.log('Opening live chat');
    var liveChatContent = document.querySelector('#lovable-livechat-content');
    var mainContent = document.querySelector('#lovable-widget-channels');
    var liveChatButton = document.querySelector('.live-chat-section');
    var modalHeader = document.querySelector('#lovable-modal-header');
    var videoContent = document.querySelector('.hiclient-video-container');
    
    if (liveChatContent && mainContent) {
      // Hide main modal content
      mainContent.style.display = 'none';
      if (liveChatButton) liveChatButton.style.display = 'none';
      if (modalHeader) modalHeader.style.display = 'none';
      if (videoContent) videoContent.style.display = 'none';
      
      // Show live chat content
      liveChatContent.style.display = 'block';
      
      // Setup pre-chat form
      setupPreChatForm();
    }
  }

  function setupPreChatForm() {
    // Show pre-chat form, hide chat interface
    var prechatForm = document.querySelector('#lovable-prechat-form');
    var chatMessages = document.querySelector('#lovable-livechat-messages');
    var chatInput = document.querySelector('#lovable-livechat-input-area');
    
    if (prechatForm) prechatForm.style.display = 'flex';
    if (chatMessages) chatMessages.style.display = 'none';
    if (chatInput) chatInput.style.display = 'none';
    
    // Configure form fields based on settings
    var config = {{WIDGET_CONFIG}};
    var nameField = document.querySelector('[data-field="name"]');
    var emailField = document.querySelector('[data-field="email"]');
    var phoneField = document.querySelector('[data-field="phone"]');
    var customFieldsContainer = document.querySelector('#prechat-custom-fields');
    
    // Show/hide required fields
    if (nameField) nameField.style.display = config.liveChatRequireName ? 'flex' : 'none';
    if (emailField) emailField.style.display = config.liveChatRequireEmail ? 'flex' : 'none';
    if (phoneField) phoneField.style.display = config.liveChatRequirePhone ? 'flex' : 'none';
    
    // Add custom fields
    if (customFieldsContainer && config.liveChatCustomFields) {
      var customFields = config.liveChatCustomFields.split(',').map(f => f.trim()).filter(f => f);
      customFieldsContainer.innerHTML = '';
      
      customFields.forEach(function(fieldName, index) {
        var fieldDiv = document.createElement('div');
        fieldDiv.className = 'prechat-field';
        fieldDiv.innerHTML = 
          '<label for="prechat-custom-' + index + '">' + fieldName + '</label>' +
          '<input type="text" id="prechat-custom-' + index + '" placeholder="Enter ' + fieldName.toLowerCase() + '" />';
        customFieldsContainer.appendChild(fieldDiv);
      });
    }
  }

  function submitPreChatForm() {
    var config = {{WIDGET_CONFIG}};
    var isValid = true;
    var userData = {};
    
    // Validate required fields
    if (config.liveChatRequireName) {
      var nameInput = document.querySelector('#prechat-name');
      if (!nameInput || !nameInput.value.trim()) {
        isValid = false;
        if (nameInput) nameInput.style.borderColor = '#ef4444';
      } else {
        userData.name = nameInput.value.trim();
        nameInput.style.borderColor = '#d1d5db';
      }
    }
    
    if (config.liveChatRequireEmail) {
      var emailInput = document.querySelector('#prechat-email');
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        if (emailInput) emailInput.style.borderColor = '#ef4444';
      } else {
        userData.email = emailInput.value.trim();
        emailInput.style.borderColor = '#d1d5db';
      }
    }
    
    if (config.liveChatRequirePhone) {
      var phoneInput = document.querySelector('#prechat-phone');
      if (phoneInput && phoneInput.value.trim()) {
        userData.phone = phoneInput.value.trim();
      }
    }
    
    // Collect custom fields and include in message
    var customFields = config.liveChatCustomFields ? config.liveChatCustomFields.split(',').map(f => f.trim()).filter(f => f) : [];
    var customFieldsData = {};
    customFields.forEach(function(fieldName, index) {
      var customInput = document.querySelector('#prechat-custom-' + index);
      if (customInput && customInput.value.trim()) {
        customFieldsData[fieldName] = customInput.value.trim();
        userData[fieldName] = customInput.value.trim();
      }
    });
    
    if (!isValid) {
      return;
    }
    
    // Start chat session
    startChatSession(userData, customFieldsData);
  }

  // Realtime setup
  let realtimeWs = null;
  
  function setupRealtimeSubscription(sessionId) {
    if (realtimeWs) {
      realtimeWs.close();
    }
    
    // Create WebSocket connection to Supabase Realtime
    const wsUrl = 'wss://ttzioshkresaqmsodhfb.supabase.co/realtime/v1/websocket?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0emlvc2hrcmVzYXFtc29kaGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDM3NjksImV4cCI6MjA2NjAxOTc2OX0.2haK7pikLtZOmf4nsmcb8wcvjbYaZLzR7ESug0R4oX0&vsn=1.0.0';
    
    realtimeWs = new WebSocket(wsUrl);
    
    realtimeWs.onopen = function() {
      console.log('Realtime connected');
      
      // Join messages channel
      var messagesJoin = {
        topic: 'realtime:public:live_chat_messages',
        event: 'phx_join',
        payload: { 
          config: { 
            postgres_changes: [
              { event: 'INSERT', schema: 'public', table: 'live_chat_messages', filter: 'session_id=eq.' + sessionId }
            ]
          }
        },
        ref: '1'
      };
      realtimeWs.send(JSON.stringify(messagesJoin));
      
      // Join sessions channel
      var sessionsJoin = {
        topic: 'realtime:public:chat_sessions',
        event: 'phx_join',
        payload: { 
          config: { 
            postgres_changes: [
              { event: 'UPDATE', schema: 'public', table: 'chat_sessions', filter: 'id=eq.' + sessionId }
            ]
          }
        },
        ref: '2'
      };
      realtimeWs.send(JSON.stringify(sessionsJoin));
    };
    
    realtimeWs.onmessage = function(event) {
      var message = JSON.parse(event.data);
      
      if (message.event === 'postgres_changes' && message.payload) {
        var payload = message.payload;
        
        if (payload.table === 'live_chat_messages' && payload.eventType === 'INSERT') {
          var newMessage = payload.new;
          if (newMessage.session_id === sessionId && !newMessage.is_from_visitor) {
            // Add agent message to chat
            addAgentMessageToChat(newMessage.message, newMessage.sender_name);
          }
        }
        
        if (payload.table === 'chat_sessions' && payload.eventType === 'UPDATE') {
          var sessionUpdate = payload.new;
          if (sessionUpdate.status === 'ended') {
            // Session ended by agent
            showSessionEndedMessage();
            window.liveChatSessionId = null;
            if (realtimeWs) {
              realtimeWs.close();
            }
          }
        }
      }
    };
    
    realtimeWs.onerror = function(error) {
      console.error('Realtime error:', error);
    };
    
    realtimeWs.onclose = function() {
      console.log('Realtime disconnected');
    };
  }
  
  function addAgentMessageToChat(messageText, senderName) {
    var messagesDiv = document.querySelector('#lovable-livechat-messages');
    if (messagesDiv) {
      var agentMessage = document.createElement('div');
      agentMessage.className = 'chat-message agent-message';
      agentMessage.innerHTML = '<div class="message-content">' + escapeHtml(messageText) + '</div>';
      messagesDiv.appendChild(agentMessage);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }
  
  function showSessionEndedMessage() {
    var messagesDiv = document.querySelector('#lovable-livechat-messages');
    if (messagesDiv) {
      var endMessage = document.createElement('div');
      endMessage.className = 'chat-message system-message';
      endMessage.innerHTML = '<div class="message-content">Chat session has been ended by the agent.</div>';
      messagesDiv.appendChild(endMessage);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      
      // Disable input
      var input = document.querySelector('#lovable-livechat-input');
      var sendBtn = document.querySelector('#lovable-livechat-send');
      if (input) input.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
    }
  }

  function startChatSession(userData, customFieldsData) {
    var config = {{WIDGET_CONFIG}};
    
    // Call edge function to create session
    fetch('https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/live-chat-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'start_session',
        data: {
          widget_id: '{{WIDGET_ID}}',
          visitor_name: userData.name || 'Anonymous',
          visitor_email: userData.email || null,
          visitor_phone: userData.phone || null,
          custom_fields: customFieldsData
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.session_id) {
        window.liveChatSessionId = data.session_id;
        window.liveChatUserData = userData;
        // Setup realtime subscription
        setupRealtimeSubscription(data.session_id);
        showChatInterface();
      } else {
        console.error('Failed to start chat session:', data);
      }
    })
    .catch(error => {
      console.error('Error starting chat session:', error);
      // Still show chat interface for offline mode
      window.liveChatUserData = userData;
      showChatInterface();
    });
  }

  function showChatInterface() {
    var config = {{WIDGET_CONFIG}};
    var userData = window.liveChatUserData || {};
    
    // Hide pre-chat form, show chat interface
    var prechatForm = document.querySelector('#lovable-prechat-form');
    var chatMessages = document.querySelector('#lovable-livechat-messages');
    var chatInput = document.querySelector('#lovable-livechat-input-area');
    
    if (prechatForm) prechatForm.style.display = 'none';
    if (chatMessages) chatMessages.style.display = 'flex';
    if (chatInput) chatInput.style.display = 'flex';
    
    // Add initial message from agent with user's name
    if (chatMessages && chatMessages.children.length === 0) {
      var initialMessage = document.createElement('div');
      initialMessage.className = 'chat-message agent-message';
      var greeting = config.liveChatGreeting || 'Hello! How can we help you today?';
      if (userData.name) {
        greeting = 'Hello ' + userData.name + '! How can we help you today?';
      }
      initialMessage.innerHTML = '<div class="message-content">' + greeting + '</div>';
      chatMessages.appendChild(initialMessage);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function closeLiveChat() {
    console.log('Closing live chat');
    var liveChatContent = document.querySelector('#lovable-livechat-content');
    var mainContent = document.querySelector('#lovable-widget-channels');
    var liveChatButton = document.querySelector('.live-chat-section');
    var modalHeader = document.querySelector('#lovable-modal-header');
    var videoContent = document.querySelector('.hiclient-video-container');
    
    if (liveChatContent && mainContent) {
      // Hide live chat content
      liveChatContent.style.display = 'none';
      
      // Show main modal content
      mainContent.style.display = 'block';
      if (liveChatButton) liveChatButton.style.display = 'block';
      if (modalHeader) modalHeader.style.display = 'block';
      if (videoContent) videoContent.style.display = 'block';
      
      // Reset pre-chat form
      var prechatForm = document.querySelector('#lovable-prechat-form');
      var chatMessages = document.querySelector('#lovable-livechat-messages');
      var chatInput = document.querySelector('#lovable-livechat-input-area');
      
      if (prechatForm) prechatForm.style.display = 'block';
      if (chatMessages) chatMessages.style.display = 'none';
      if (chatInput) chatInput.style.display = 'none';
    }
  }

  function endChatSession() {
    console.log('Ending chat session');
    
    // Send end session request to server if session exists
    if (window.liveChatSessionId) {
      fetch('https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/live-chat-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'end_session',
          data: {
            session_id: window.liveChatSessionId
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Chat session ended successfully');
        } else {
          console.error('Failed to end session:', data);
        }
      })
      .catch(error => {
        console.error('Error ending session:', error);
      });
    }
    
    // Close realtime connection
    if (realtimeWs) {
      realtimeWs.close();
      realtimeWs = null;
    }
    
    // Clear session data
    window.liveChatSessionId = null;
    window.liveChatUserData = null;
    
    // Close live chat UI
    closeLiveChat();
  }

  function sendMessage() {
    var input = document.querySelector('#lovable-livechat-input');
    var messagesDiv = document.querySelector('#lovable-livechat-messages');
    var userData = window.liveChatUserData || {};
    
    if (input && messagesDiv && input.value.trim()) {
      var messageText = input.value.trim();
      
      // Add user message to UI immediately
      var userMessage = document.createElement('div');
      userMessage.className = 'chat-message user-message';
      userMessage.innerHTML = '<div class="message-content">' + escapeHtml(messageText) + '</div>';
      messagesDiv.appendChild(userMessage);
      
      // Clear input
      input.value = '';
      
      // Scroll to bottom
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      
      // Send message to server if session exists
      if (window.liveChatSessionId) {
        fetch('https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/live-chat-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send_message',
            data: {
              widget_id: '{{WIDGET_ID}}',
              session_id: window.liveChatSessionId,
              message: messageText,
              sender_name: userData.name || 'Anonymous',
              sender_email: userData.email || null,
              is_from_visitor: true
            }
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Message saved to database');
          } else {
            console.error('Failed to save message:', data);
          }
        })
        .catch(error => {
          console.error('Error saving message:', error);
        });
      }
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
  
  var channelsData = {{CHANNELS_DATA}};
  
  function openChannel(url) {
    window.open(url, '_blank');
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
    
    // Initialize live chat
    var liveChatBtn = document.querySelector('#lovable-livechat-btn');
    var liveChatBack = document.querySelector('#lovable-livechat-back');
    var liveChatSend = document.querySelector('#lovable-livechat-send');
    var liveChatInput = document.querySelector('#lovable-livechat-input');
    var prechatSubmit = document.querySelector('#prechat-submit');
    
    if (liveChatBtn) {
      liveChatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openLiveChat();
      });
    }
    
    if (liveChatBack) {
      liveChatBack.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeLiveChat();
      });
    }
    
    if (liveChatSend) {
      liveChatSend.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        sendMessage();
      });
    }
    
    if (liveChatInput) {
      liveChatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      });
    }
    
    if (prechatSubmit) {
      prechatSubmit.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        submitPreChatForm();
      });
    }
    
    // Add event listener for end chat button
    var endChatBtn = document.querySelector('#lovable-livechat-end');
    if (endChatBtn) {
      endChatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        endChatSession();
      });
    }
    
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
  
  window.refreshWidget = function() {
    var channelsContainer = document.querySelector('#lovable-widget-channels');
    if (channelsContainer) {
      var generatedHtml = generateChannelsHtml();
      channelsContainer.innerHTML = generatedHtml;
    }
  };
  
  window.openChannel = openChannel;
  window.toggleDropdown = toggleDropdown;
  window.playVideo = playVideo;
  window.openLiveChat = openLiveChat;
  window.closeLiveChat = closeLiveChat;
  window.sendMessage = sendMessage;
  window.endChatSession = endChatSession;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    setTimeout(initWidget, 100);
  }
`;

export const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Modern Clean Template', 
  description: 'Modern and clean floating widget with green accent',
  html: defaultHtmlTemplate,
  css: defaultCssStyles,
  js: defaultJavaScriptLogic
};

export const getDefaultTemplate = () => defaultTemplate;
