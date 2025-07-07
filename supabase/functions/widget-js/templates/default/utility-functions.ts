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

export function getChannelUrl(type: string, value: string): string {
  switch (type.toLowerCase()) {
    case 'whatsapp':
      return `https://wa.me/${value.replace(/\D/g, '')}`;
    case 'telegram':
      return value.startsWith('@') ? `https://t.me/${value.slice(1)}` : `https://t.me/${value}`;
    case 'instagram':
      return value.startsWith('http') ? value : `https://instagram.com/${value}`;
    case 'email':
      return `mailto:${value}`;
    case 'phone':
      return `tel:${value}`;
    default:
      return value.startsWith('http') ? value : `https://${value}`;
  }
}

export function getChannelIcon(type: string): string {
  const icons = {
    whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`
  };
  return icons[type.toLowerCase()] || `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
}

export function getChannelColor(type: string): string {
  const colors = {
    whatsapp: '#25d366',
    telegram: '#0088cc',
    instagram: '#e4405f',
    email: '#ea4335',
    phone: '#22c55e'
  };
  return colors[type.toLowerCase()] || '#6b7280';
}
