
export const defaultHtmlTemplate = `
<!-- HiClient Widget -->
<div id="hiclient-widget" class="hiclient-widget-container" style="{{POSITION_STYLE}}">
  
  <!-- Live Chat Modal (shown when live chat is enabled and active) -->
  <div id="hiclient-live-chat-modal" class="hiclient-live-chat-modal" style="display: none;">
    <div class="hiclient-live-chat-header">
      <div class="hiclient-live-chat-title">Live Chat</div>
      <button id="hiclient-live-chat-minimize" class="hiclient-live-chat-btn">−</button>
      <button id="hiclient-live-chat-close" class="hiclient-live-chat-btn">×</button>
    </div>
    <div class="hiclient-live-chat-messages" id="hiclient-live-chat-messages">
      <div class="hiclient-live-chat-greeting">{{LIVE_CHAT_GREETING}}</div>
    </div>
    <div class="hiclient-live-chat-input-container">
      <input type="text" id="hiclient-live-chat-input" placeholder="Type your message..." />
      <button id="hiclient-live-chat-send" class="hiclient-live-chat-send-btn">Send</button>
    </div>
  </div>

  <!-- Contact Modal -->
  <div id="hiclient-modal" class="hiclient-modal" style="display: none;">
    <div class="hiclient-modal-overlay" id="hiclient-modal-overlay"></div>
    <div class="hiclient-modal-content" style="{{MODAL_CONTENT_POSITION}}">
      <div class="hiclient-modal-header">
        <h3 class="hiclient-modal-title">{{GREETING_MESSAGE}}</h3>
        <button class="hiclient-close-btn" id="hiclient-close-btn">&times;</button>
      </div>
      
      <div class="hiclient-modal-body">
        <!-- Video Content -->
        {{VIDEO_CONTENT}}
        
        <!-- Live Chat Section (if enabled) -->
        <div id="hiclient-live-chat-section" class="hiclient-live-chat-section" style="display: none;">
          <button id="hiclient-start-live-chat" class="hiclient-live-chat-start-btn">
            <span class="hiclient-live-chat-icon">💬</span>
            Start Live Chat
          </button>
        </div>
        
        <!-- Contact Channels -->
        <div class="hiclient-channels-container">
          <div class="hiclient-channels-grid" id="hiclient-channels-grid">
            <!-- Channels will be populated by JavaScript -->
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Tooltip -->
  <div id="hiclient-tooltip" class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}}; display: none;">
    {{TOOLTIP_TEXT}}
  </div>
  
  <!-- Main Button -->
  <button id="hiclient-btn" class="hiclient-btn hiclient-btn-{{POSITION}}" style="{{BUTTON_OFFSET_STYLE}} background-color: {{BUTTON_COLOR}}; width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px;">
    {{BUTTON_ICON}}
  </button>
</div>
`
