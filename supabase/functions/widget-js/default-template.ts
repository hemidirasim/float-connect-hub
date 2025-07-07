import type { WidgetTemplate } from './template-types.ts'

export function getDefaultTemplate(): WidgetTemplate {
  return {
    id: 'default',
    name: 'Default Template',
    description: 'Classic floating widget with customizable colors and positioning',
    html: `
<div id="lovable-widget-container" style="position: fixed !important; {{POSITION_STYLE}} bottom: 20px !important; z-index: 99999 !important; pointer-events: auto !important;">
  <div id="lovable-widget-relative-container" style="position: relative !important;">
    <div id="lovable-widget-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
    <button id="lovable-widget-button" style="width: {{BUTTON_SIZE}}px !important; height: {{BUTTON_SIZE}}px !important; background-color: {{BUTTON_COLOR}} !important; {{BUTTON_OFFSET_STYLE}} display: flex !important; visibility: visible !important; opacity: 1 !important; border: none !important; border-radius: 50% !important; cursor: pointer !important; position: relative !important; z-index: 100000 !important;">
      {{BUTTON_ICON}}
    </button>
  </div>
</div>

<div id="lovable-widget-modal" style="display: none; visibility: hidden; opacity: 0; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 99998;">
  <div id="lovable-modal-content" style="transform: translateY(20px); background: white; border-radius: 12px; width: min(400px, 90vw); max-height: 80vh; overflow-y: auto; padding: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); position: relative; margin: auto; margin-top: 50px;">
    <div id="lovable-modal-header">{{GREETING_MESSAGE}}</div>
    <button id="lovable-widget-close" style="position: absolute; top: 12px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666; padding: 4px; line-height: 1;">×</button>
    {{VIDEO_CONTENT}}
    <div id="lovable-widget-channels"></div>
    <div id="lovable-live-chat-container" style="display: none;"></div>
    <div class="lovable-empty-state" style="display: none;">
      <div class="lovable-empty-icon">📱</div>
      <p>No channels configured</p>
    </div>
  </div>
</div>
`,
    css: `
      /* Force widget button visibility */
      #lovable-widget-button {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        border: none !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        transition: all 0.3s ease !important;
        align-items: center !important;
        justify-content: center !important;
        color: white !important;
        font-size: 24px !important;
        text-decoration: none !important;
        z-index: 100000 !important;
        position: relative !important;
        pointer-events: auto !important;
      }
      
      #lovable-widget-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        position: fixed !important;
        z-index: 99999 !important;
        bottom: 20px !important;
        pointer-events: auto !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      #lovable-widget-button:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
      }
      
      /* Tooltip styles */
      #lovable-widget-tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 100001;
        transition: all 0.2s ease;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      /* Modal styles */
      #lovable-widget-modal {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.5) !important;
        z-index: 99998 !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        align-items: flex-end !important;
        justify-content: flex-end !important;
        padding: 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      }
      
      #lovable-modal-content {
        background: white !important;
        border-radius: 12px !important;
        width: min(400px, 90vw) !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        padding: 20px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        transition: transform 0.3s ease !important;
        position: relative !important;
      }
      
      /* Position modal based on button position */
      #lovable-widget-modal.position-right {
        justify-content: flex-end !important;
      }
      
      #lovable-widget-modal.position-left {
        justify-content: flex-start !important;
      }
      
      #lovable-widget-modal.position-center {
        justify-content: center !important;
      }
      
      #lovable-modal-header {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #333;
        white-space: pre-line;
      }
      
      #lovable-widget-close:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        transform: rotate(90deg);
      }
      
      /* Channel item styles */
      .lovable-channel-item {
        display: flex;
        align-items: center;
        padding: 12px;
        margin-bottom: 8px;
        background: #f8f9fa;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: all 0.2s ease;
        cursor: pointer;
      }
      
      .lovable-channel-item:hover {
        background: #e9ecef;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .lovable-channel-icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      /* Video styles */
      .hiclient-video {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 16px;
      }
      
      /* Empty state styles */
      .lovable-empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #666;
      }
      
      .lovable-empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      /* Live Chat Styles */
      #lovable-live-chat-container {
        border-top: 1px solid #e5e7eb;
        margin-top: 16px;
        padding-top: 16px;
      }

      .lovable-live-chat-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 600;
        color: #374151;
      }

      .lovable-live-chat-messages {
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 12px;
        padding: 8px;
        background: #f9fafb;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
      }

      .lovable-chat-message {
        margin-bottom: 8px;
        padding: 8px 12px;
        border-radius: 8px;
        max-width: 80%;
      }

      .lovable-chat-message.visitor {
        background: #3b82f6;
        color: white;
        margin-left: auto;
        text-align: right;
      }

      .lovable-chat-message.agent {
        background: #e5e7eb;
        color: #374151;
        margin-right: auto;
      }

      .lovable-chat-message-sender {
        font-size: 12px;
        opacity: 0.8;
        margin-bottom: 4px;
      }

      .lovable-chat-input-container {
        display: flex;
        gap: 8px;
      }

      .lovable-chat-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        outline: none;
      }

      .lovable-chat-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
      }

      .lovable-chat-send-btn {
        padding: 8px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
      }

      .lovable-chat-send-btn:hover {
        background: #2563eb;
      }

      .lovable-chat-send-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      /* Responsive styles */
      @media (max-width: 768px) {
        #lovable-widget-modal {
          padding: 10px !important;
        }
        
        #lovable-modal-content {
          width: calc(100% - 20px) !important;
          max-width: none !important;
        }
      }
      
      /* Force visibility for everything - CRITICAL */
      #lovable-widget-container,
      #lovable-widget-container *,
      #lovable-widget-button,
      #lovable-widget-relative-container {
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
      }
      
      #lovable-widget-button {
        display: flex !important;
      }
    `,
    js: `
      console.log('🔥 Widget script starting - FORCED VISIBILITY VERSION');
      
      // Widget configuration
      let channels = [];
      let liveChatEnabled = false;
      let liveChatAgentName = 'Support Team';
      let widgetPosition = 'right';
      
      // Parse configuration data
      try {
        const channelsData = '{{CHANNELS_DATA}}';
        if (channelsData && channelsData !== '{{CHANNELS_DATA}}') {
          channels = JSON.parse(channelsData);
        }
        liveChatEnabled = '{{LIVE_CHAT_ENABLED}}' === 'true';
        liveChatAgentName = '{{LIVE_CHAT_AGENT_NAME}}' || 'Support Team';
        widgetPosition = '{{POSITION}}' || 'right';
        
        console.log('🔥 Widget config:', {
          channels: channels.length,
          position: widgetPosition,
          liveChatEnabled: liveChatEnabled
        });
      } catch (e) {
        console.error('❌ Error parsing widget data:', e);
      }

      // FORCE BUTTON VISIBILITY FUNCTION
      function forceButtonVisibility() {
        const button = document.getElementById('lovable-widget-button');
        const container = document.getElementById('lovable-widget-container');
        
        if (button) {
          console.log('🔥 FORCING BUTTON VISIBILITY');
          button.style.display = 'flex';
          button.style.visibility = 'visible';
          button.style.opacity = '1';
          button.style.pointerEvents = 'auto';
          button.style.position = 'relative';
          button.style.zIndex = '100000';
          button.style.width = '{{BUTTON_SIZE}}px';
          button.style.height = '{{BUTTON_SIZE}}px';
          button.style.backgroundColor = '{{BUTTON_COLOR}}';
          button.style.border = 'none';
          button.style.borderRadius = '50%';
          button.style.cursor = 'pointer';
          button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';
          button.style.color = 'white';
          button.style.fontSize = '24px';
          
          console.log('✅ Button visibility forced:', button.style.cssText);
        } else {
          console.error('❌ Button element not found!');
        }
        
        if (container) {
          console.log('🔥 FORCING CONTAINER VISIBILITY');
          container.style.display = 'block';
          container.style.visibility = 'visible';
          container.style.opacity = '1';
          container.style.position = 'fixed';
          container.style.bottom = '20px';
          container.style.zIndex = '99999';
          container.style.pointerEvents = 'auto';
          
          console.log('✅ Container visibility forced:', container.style.cssText);
        } else {
          console.error('❌ Container element not found!');
        }
      }

      // Initialize widget immediately
      function initializeWidget() {
        console.log('🔥 Initializing widget elements...');
        
        // Force visibility first
        forceButtonVisibility();
        
        // Get DOM elements
        const modal = document.getElementById('lovable-widget-modal');
        const button = document.getElementById('lovable-widget-button');
        const closeBtn = document.getElementById('lovable-widget-close');
        const channelsContainer = document.getElementById('lovable-widget-channels');
        const liveChatContainer = document.getElementById('lovable-live-chat-container');
        const tooltip = document.getElementById('lovable-widget-tooltip');

        console.log('🔥 DOM elements found:', {
          modal: !!modal,
          button: !!button,
          closeBtn: !!closeBtn,
          channelsContainer: !!channelsContainer
        });

        // Set modal position class
        if (modal) {
          modal.classList.add('position-' + widgetPosition);
        }

        // Tooltip functions
        function showTooltip() {
          const tooltipDisplay = '{{TOOLTIP_DISPLAY}}';
          if (tooltipDisplay === 'hover' && tooltip) {
            tooltip.style.display = 'block';
          }
        }

        function hideTooltip() {
          if (tooltip) {
            tooltip.style.display = 'none';
          }
        }

        // Button event listeners
        if (button) {
          button.addEventListener('mouseenter', showTooltip);
          button.addEventListener('mouseleave', hideTooltip);
          button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔥 Button clicked, opening modal');
            
            if (modal) {
              modal.style.display = 'flex';
              modal.style.visibility = 'visible';
              modal.style.opacity = '1';
              
              const content = document.getElementById('lovable-modal-content');
              if (content) {
                content.style.transform = 'translateY(0)';
              }
              console.log('✅ Modal opened');
            }
          });
          
          console.log('✅ Button event listeners attached');
        } else {
          console.error('❌ Button element not found for event listeners!');
        }

        // Close button event listener
        if (closeBtn) {
          closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔥 Close button clicked');
            
            if (modal) {
              modal.style.opacity = '0';
              const content = document.getElementById('lovable-modal-content');
              if (content) {
                content.style.transform = 'translateY(20px)';
              }
              setTimeout(function() {
                modal.style.visibility = 'hidden';
                modal.style.display = 'none';
              }, 300);
            }
          });
        }

        // Modal backdrop click
        if (modal) {
          modal.addEventListener('click', function(e) {
            if (e.target === modal) {
              if (closeBtn) {
                closeBtn.click();
              }
            }
          });
        }

        // Re-force visibility after initialization
        setTimeout(forceButtonVisibility, 100);
        setTimeout(forceButtonVisibility, 500);
        setTimeout(forceButtonVisibility, 1000);

        // Render channels
        renderChannels();
        
        // Initialize live chat if enabled
        if (liveChatEnabled) {
          initLiveChat();
        }
        
        console.log('✅ Widget initialization complete');
      }

      // Channel rendering functions
      function renderChannels() {
        const channelsContainer = document.getElementById('lovable-widget-channels');
        if (!channelsContainer) return;
        
        console.log('🔥 Rendering channels:', channels.length);
        
        if (channels.length === 0) {
          const emptyState = document.querySelector('.lovable-empty-state');
          if (emptyState) {
            emptyState.style.display = 'block';
          }
          return;
        }

        const channelsHtml = channels.map(function(channel) {
          const iconHtml = channel.customIcon 
            ? '<img src="' + channel.customIcon + '" alt="' + channel.label + '" class="lovable-channel-icon" />'
            : getChannelIcon(channel.type);
          
          return '<div class="lovable-channel-item" onclick="openChannel(\\'' + getChannelUrl(channel) + '\\')">' +
            iconHtml +
            '<span>' + channel.label + '</span>' +
          '</div>';
        }).join('');
        
        channelsContainer.innerHTML = channelsHtml;
        console.log('✅ Channels rendered');
      }

      function getChannelIcon(type) {
        const icons = {
          whatsapp: '💬',
          telegram: '✈️',
          email: '📧',
          phone: '📞',
          instagram: '📷',
          facebook: '👥',
          twitter: '🐦',
          linkedin: '💼',
          youtube: '📺',
          tiktok: '🎵',
          discord: '🎮',
          custom: '🔗'
        };
        return icons[type] || '🔗';
      }

      function getChannelUrl(channel) {
        switch (channel.type) {
          case 'whatsapp':
            return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
          case 'telegram':
            return 'https://t.me/' + channel.value.replace('@', '');
          case 'email':
            return 'mailto:' + channel.value;
          case 'phone':
            return 'tel:' + channel.value;
          case 'instagram':
            return channel.value.startsWith('http') ? channel.value : 'https://instagram.com/' + channel.value;
          default:
            return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
        }
      }

      // Global function for opening channels
      window.openChannel = function(url) {
        console.log('🔥 Opening channel:', url);
        window.open(url, '_blank');
      };

      // Live Chat Functionality
      function initLiveChat() {
        const liveChatContainer = document.getElementById('lovable-live-chat-container');
        if (!liveChatContainer) return;
        
        console.log('🔥 Initializing live chat');
        
        liveChatContainer.style.display = 'block';
        liveChatContainer.innerHTML = '<div class="lovable-live-chat-header">' +
          '<span>💬</span>' +
          '<span>Chat with ' + liveChatAgentName + '</span>' +
        '</div>' +
        '<div class="lovable-live-chat-messages" id="lovable-chat-messages">' +
          '<div class="lovable-chat-message agent">' +
            '<div class="lovable-chat-message-sender">' + liveChatAgentName + '</div>' +
            '<div>Hello! How can we help you today?</div>' +
          '</div>' +
        '</div>' +
        '<div class="lovable-chat-input-container">' +
          '<input type="text" class="lovable-chat-input" id="lovable-chat-message-input" placeholder="Type your message..." />' +
          '<button class="lovable-chat-send-btn" id="lovable-chat-send-btn">Send</button>' +
        '</div>';

        const messageInput = document.getElementById('lovable-chat-message-input');
        const sendBtn = document.getElementById('lovable-chat-send-btn');
        const messagesContainer = document.getElementById('lovable-chat-messages');

        function sendMessage() {
          const message = messageInput.value.trim();
          if (!message) return;

          // Add visitor message
          const messageEl = document.createElement('div');
          messageEl.className = 'lovable-chat-message visitor';
          messageEl.innerHTML = '<div class="lovable-chat-message-sender">You</div>' +
            '<div>' + message + '</div>';
          messagesContainer.appendChild(messageEl);
          
          messageInput.value = '';
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          console.log('Live chat message sent:', message);
          
          // Auto-response
          setTimeout(function() {
            const responseEl = document.createElement('div');
            responseEl.className = 'lovable-chat-message agent';
            responseEl.innerHTML = '<div class="lovable-chat-message-sender">' + liveChatAgentName + '</div>' +
              '<div>Thank you for your message! We will get back to you shortly.</div>';
            messagesContainer.appendChild(responseEl);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }, 1000);
        }

        if (sendBtn) {
          sendBtn.addEventListener('click', sendMessage);
        }

        if (messageInput) {
          messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              sendMessage();
            }
          });
        }
      }

      // Multiple initialization attempts
      console.log('🔥 Starting widget initialization process...');
      
      // Try immediate initialization
      if (document.readyState === 'complete') {
        console.log('🔥 DOM already complete, initializing immediately');
        initializeWidget();
      } else if (document.readyState === 'interactive') {
        console.log('🔥 DOM interactive, initializing with small delay');
        setTimeout(initializeWidget, 50);
      } else {
        console.log('🔥 DOM still loading, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', initializeWidget);
      }
      
      // Backup initialization
      setTimeout(function() {
        console.log('🔥 Backup initialization trigger');
        initializeWidget();
      }, 200);
      
      // Final backup
      setTimeout(function() {
        console.log('🔥 Final backup initialization trigger');
        initializeWidget();
      }, 1000);
      
      console.log('✅ Widget script loaded with forced visibility');
    `
  };
}
