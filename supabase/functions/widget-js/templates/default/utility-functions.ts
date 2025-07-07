export const defaultUtilityFunctions = `
// HiClient Widget JavaScript Functionality
(function() {
  const widgetId = '{{WIDGET_ID}}';
  const liveChatEnabled = {{LIVE_CHAT_ENABLED}};
  const liveChatGreeting = '{{LIVE_CHAT_GREETING}}';
  const liveChatColor = '{{LIVE_CHAT_COLOR}}';
  const liveChatAutoOpen = {{LIVE_CHAT_AUTO_OPEN}};
  const liveChatOfflineMessage = '{{LIVE_CHAT_OFFLINE_MESSAGE}}';
  
  let currentChatSession = null;
  let chatMessages = [];
  let liveChatVisible = false;
  
  // Generate unique visitor ID
  function generateVisitorId() {
    return 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  // Get or create visitor ID
  function getVisitorId() {
    let visitorId = localStorage.getItem('hiclient_visitor_id');
    if (!visitorId) {
      visitorId = generateVisitorId();
      localStorage.setItem('hiclient_visitor_id', visitorId);
    }
    return visitorId;
  }

  // Function to open a channel link
  window.openChannel = function(url) {
    window.open(url, '_blank');
  };

  // Function to record widget view
  function recordWidgetView() {
    fetch('{{SUPABASE_URL}}/functions/v1/record-widget-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {{SUPABASE_ANON_KEY}}'
      },
      body: JSON.stringify({ widget_id: widgetId })
    }).then(res => res.json())
      .then(data => console.log('Widget view recorded:', data))
      .catch(error => console.error('Error recording widget view:', error));
  }

  // Initialize widget
  function initializeWidget() {
    // Record widget view
    recordWidgetView();

    // Button element
    const btn = document.getElementById('hiclient-btn');
    if (btn) {
      btn.addEventListener('click', openModal);
    }

    // Modal elements
    const modal = document.getElementById('hiclient-modal');
    const closeBtn = document.getElementById('hiclient-close-btn');
    const modalOverlay = document.getElementById('hiclient-modal-overlay');

    // Open modal function
    function openModal() {
      if (modal) {
        modal.style.display = 'block';
        // Show live chat section if enabled
        if (liveChatEnabled) {
          const liveChatSection = document.getElementById('hiclient-live-chat-section');
          if (liveChatSection) {
            liveChatSection.style.display = 'block';
          }
        }
      }
    }

    // Close modal function
    function closeModal() {
      if (modal) {
        modal.style.display = 'none';
      }
    }

    // Close modal when clicking the close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    // Tooltip elements
    const tooltip = document.getElementById('hiclient-tooltip');
    const tooltipDisplay = '{{TOOLTIP_DISPLAY}}';

    // Show tooltip on hover
    if (btn && tooltip && tooltipDisplay === 'hover') {
      btn.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
      });

      btn.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    }

    // Show tooltip always
    if (tooltip && tooltipDisplay === 'always') {
      tooltip.style.display = 'block';
    }

    // Channel data
    const channelsData = JSON.parse('{{CHANNELS_DATA}}');
    const channelsGrid = document.getElementById('hiclient-channels-grid');

    // Populate channels
    if (channelsGrid && channelsData && channelsData.length > 0) {
      channelsData.forEach(channel => {
        const channelElement = document.createElement('div');
        channelElement.className = 'hiclient-channel';
        channelElement.innerHTML = \`<a href="\${channel.value}" target="_blank" rel="noopener noreferrer">\${channel.label}</a>\`;
        channelsGrid.appendChild(channelElement);
      });
    }
    
    // Show live chat section if enabled
    if (liveChatEnabled) {
      const liveChatSection = document.getElementById('hiclient-live-chat-section');
      if (liveChatSection) {
        liveChatSection.style.display = 'block';
      }
    }
  }

  // Live Chat Functions
  async function startLiveChat() {
    try {
      const visitorId = getVisitorId();
      const response = await fetch('{{SUPABASE_URL}}/functions/v1/live-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer {{SUPABASE_ANON_KEY}}'
        },
        body: JSON.stringify({
          action: 'create_session',
          widget_id: widgetId,
          visitor_id: visitorId,
          visitor_name: null,
          visitor_email: null,
          user_agent: navigator.userAgent,
          ip_address: null // Will be handled server-side
        })
      });
      
      const data = await response.json();
      if (data.success) {
        currentChatSession = data.session_id;
        showLiveChat();
        closeModal();
      }
    } catch (error) {
      console.error('Error starting live chat:', error);
    }
  }
  
  function showLiveChat() {
    const chatModal = document.getElementById('hiclient-live-chat-modal');
    if (chatModal) {
      chatModal.style.display = 'flex';
      liveChatVisible = true;
      loadChatMessages();
    }
  }
  
  function hideLiveChat() {
    const chatModal = document.getElementById('hiclient-live-chat-modal');
    if (chatModal) {
      chatModal.style.display = 'none';
      liveChatVisible = false;
    }
  }
  
  async function sendMessage(message) {
    if (!currentChatSession || !message.trim()) return;
    
    try {
      const response = await fetch('{{SUPABASE_URL}}/functions/v1/live-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer {{SUPABASE_ANON_KEY}}'
        },
        body: JSON.stringify({
          action: 'send_message',
          session_id: currentChatSession,
          sender_type: 'visitor',
          sender_id: getVisitorId(),
          message: message
        })
      });
      
      const data = await response.json();
      if (data.success) {
        displayMessage('visitor', message, new Date());
        document.getElementById('hiclient-live-chat-input').value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  
  async function loadChatMessages() {
    if (!currentChatSession) return;
    
    try {
      const response = await fetch('{{SUPABASE_URL}}/functions/v1/live-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer {{SUPABASE_ANON_KEY}}'
        },
        body: JSON.stringify({
          action: 'get_messages',
          session_id: currentChatSession
        })
      });
      
      const data = await response.json();
      if (data.success) {
        data.messages.forEach(msg => {
          displayMessage(msg.sender_type, msg.message, new Date(msg.created_at));
        });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }
  
  function displayMessage(senderType, message, timestamp) {
    const messagesContainer = document.getElementById('hiclient-live-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = \`hiclient-live-chat-message \${senderType}\`;
    
    const time = timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageDiv.innerHTML = \`
      <div class="hiclient-live-chat-message-bubble">\${message}</div>
      <div class="hiclient-live-chat-message-time">\${time}</div>
    \`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Initialize widget
  function initializeWidget() {
    // Record widget view
    recordWidgetView();

    // Button element
    const btn = document.getElementById('hiclient-btn');
    if (btn) {
      btn.addEventListener('click', openModal);
    }

    // Modal elements
    const modal = document.getElementById('hiclient-modal');
    const closeBtn = document.getElementById('hiclient-close-btn');
    const modalOverlay = document.getElementById('hiclient-modal-overlay');

    // Open modal function
    function openModal() {
      if (modal) {
        modal.style.display = 'block';
        // Show live chat section if enabled
        if (liveChatEnabled) {
          const liveChatSection = document.getElementById('hiclient-live-chat-section');
          if (liveChatSection) {
            liveChatSection.style.display = 'block';
          }
        }
      }
    }

    // Close modal function
    function closeModal() {
      if (modal) {
        modal.style.display = 'none';
      }
    }

    // Close modal when clicking the close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    // Tooltip elements
    const tooltip = document.getElementById('hiclient-tooltip');
    const tooltipDisplay = '{{TOOLTIP_DISPLAY}}';

    // Show tooltip on hover
    if (btn && tooltip && tooltipDisplay === 'hover') {
      btn.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
      });

      btn.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    }

    // Show tooltip always
    if (tooltip && tooltipDisplay === 'always') {
      tooltip.style.display = 'block';
    }

    // Channel data
    const channelsData = JSON.parse('{{CHANNELS_DATA}}');
    const channelsGrid = document.getElementById('hiclient-channels-grid');

    // Populate channels
    if (channelsGrid && channelsData && channelsData.length > 0) {
      channelsData.forEach(channel => {
        const channelElement = document.createElement('div');
        channelElement.className = 'hiclient-channel';
        channelElement.innerHTML = \`<a href="\${channel.value}" target="_blank" rel="noopener noreferrer">\${channel.label}</a>\`;
        channelsGrid.appendChild(channelElement);
      });
    }
    
    // Show live chat section if enabled
    if (liveChatEnabled) {
      const liveChatSection = document.getElementById('hiclient-live-chat-section');
      if (liveChatSection) {
        liveChatSection.style.display = 'block';
      }
      
      // Live chat button event
      const startLiveChatBtn = document.getElementById('hiclient-start-live-chat');
      if (startLiveChatBtn) {
        startLiveChatBtn.addEventListener('click', startLiveChat);
      }
      
      // Live chat modal events
      const liveChatClose = document.getElementById('hiclient-live-chat-close');
      const liveChatMinimize = document.getElementById('hiclient-live-chat-minimize');
      const liveChatSend = document.getElementById('hiclient-live-chat-send');
      const liveChatInput = document.getElementById('hiclient-live-chat-input');
      
      if (liveChatClose) {
        liveChatClose.addEventListener('click', hideLiveChat);
      }
      
      if (liveChatMinimize) {
        liveChatMinimize.addEventListener('click', hideLiveChat);
      }
      
      if (liveChatSend) {
        liveChatSend.addEventListener('click', () => {
          const message = liveChatInput.value;
          sendMessage(message);
        });
      }
      
      if (liveChatInput) {
        liveChatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const message = liveChatInput.value;
            sendMessage(message);
          }
        });
      }
      
      // Auto-open live chat if enabled
      if (liveChatAutoOpen) {
        setTimeout(() => {
          startLiveChat();
        }, 3000);
      }
    }
  }

  // Initialize the widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
})();
`
