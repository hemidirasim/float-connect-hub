
import type { WidgetTemplate } from './template-types.ts'

export function getDefaultTemplate(): WidgetTemplate {
  return {
    id: 'default',
    name: 'Default Template',
    description: 'Classic floating widget with customizable colors and positioning',
    html: `
<div id="lovable-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div id="lovable-widget-relative-container" style="position: relative;">
    <div id="lovable-widget-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
    <button id="lovable-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background-color: {{BUTTON_COLOR}}; {{BUTTON_OFFSET_STYLE}}">
      {{BUTTON_ICON}}
    </button>
  </div>
</div>

<div id="lovable-widget-modal" style="display: none; visibility: hidden; opacity: 0;">
  <div id="lovable-modal-content" style="transform: translateY(20px);">
    <div id="lovable-modal-header">{{GREETING_MESSAGE}}</div>
    <button id="lovable-widget-close">×</button>
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
      /* Widget container styles */
      #lovable-widget-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        position: fixed;
        z-index: 99999;
        bottom: 20px;
      }
      
      #lovable-widget-button {
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: flex !important;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        text-decoration: none;
        z-index: 100000;
        position: relative;
        visibility: visible !important;
        opacity: 1 !important;
      }
      
      #lovable-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99998;
        transition: all 0.3s ease;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      
      #lovable-modal-content {
        background: white;
        border-radius: 12px;
        width: min(400px, 90vw);
        max-height: 80vh;
        overflow-y: auto;
        padding: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
        position: relative;
      }
      
      /* Position modal based on button position */
      #lovable-widget-modal.position-right {
        justify-content: flex-end;
      }
      
      #lovable-widget-modal.position-left {
        justify-content: flex-start;
      }
      
      #lovable-widget-modal.position-center {
        justify-content: center;
      }
      
      #lovable-modal-header {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #333;
        white-space: pre-line;
      }
      
      #lovable-widget-close {
        position: absolute;
        top: 12px;
        right: 16px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 4px;
        line-height: 1;
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
          padding: 10px;
        }
        
        #lovable-modal-content {
          width: calc(100% - 20px);
          max-width: none;
        }
      }
    `,
    js: `
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
      } catch (e) {
        console.error('Error parsing widget data:', e);
      }

      // Get DOM elements
      const modal = document.getElementById('lovable-widget-modal');
      const button = document.getElementById('lovable-widget-button');
      const closeBtn = document.getElementById('lovable-widget-close');
      const channelsContainer = document.getElementById('lovable-widget-channels');
      const liveChatContainer = document.getElementById('lovable-live-chat-container');
      const tooltip = document.getElementById('lovable-widget-tooltip');

      // Ensure button is visible
      if (button) {
        button.style.display = 'flex';
        button.style.visibility = 'visible';
        button.style.opacity = '1';
        console.log('Widget button initialized and visible');
      } else {
        console.error('Widget button not found');
      }

      // Set modal position class based on widget position
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
          console.log('Button clicked, opening modal');
          if (modal) {
            modal.style.display = 'flex';
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            const content = document.getElementById('lovable-modal-content');
            if (content) {
              content.style.transform = 'translateY(0)';
            }
          }
        });
      }

      // Close button event listener
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Close button clicked');
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

      // Channel rendering functions
      function renderChannels() {
        if (!channelsContainer) return;
        
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
            return channel.value;
        }
      }

      // Global function for opening channels
      window.openChannel = function(url) {
        window.open(url, '_blank');
      };

      // Live Chat Functionality
      function initLiveChat() {
        if (!liveChatEnabled || !liveChatContainer) return;
        
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

          // Send to backend (this would be implemented with actual backend)
          console.log('Sending message:', message);
          
          // Show typing indicator and auto-response
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

      // Initialize all components when DOM is ready
      function initWidget() {
        console.log('Initializing widget...');
        console.log('Widget position:', widgetPosition);
        console.log('Live chat enabled:', liveChatEnabled);
        console.log('Channels:', channels.length);
        
        renderChannels();
        initLiveChat();
        
        // Final check - make sure button is visible
        if (button) {
          button.style.display = 'flex';
          button.style.visibility = 'visible';
          button.style.opacity = '1';
          console.log('Widget initialization complete - button should be visible');
        }
      }

      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
      } else {
        initWidget();
      }
    `
  };
}
