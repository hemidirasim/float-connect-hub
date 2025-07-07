
export const defaultHtmlTemplate = `
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
    <div style="position: relative; z-index: 1;">
      {{VIDEO_CONTENT}}
    </div>
    {{LIVE_CHAT_BUTTON}}
    <div id="lovable-widget-channels"></div>
    <div class="lovable-empty-state" style="display: none;">
      <div class="lovable-empty-icon">📱</div>
      <p>No channels configured</p>
    </div>
    
    <!-- Live chat content inside main modal -->
    <div id="lovable-livechat-content" style="display: none;">
      <div id="lovable-livechat-header">
        <h3>{{LIVE_CHAT_GREETING}}</h3>
        <div class="livechat-controls">
          <button id="lovable-livechat-back">← Back</button>
          <button id="lovable-livechat-end" class="end-chat-btn">Söhbəti Bitir</button>
        </div>
      </div>
      
      <!-- Pre-chat form -->
      <div id="lovable-prechat-form">
        <div class="prechat-title">{{PRECHAT_FORM_TITLE}}</div>
        <div class="prechat-fields">
          <div class="prechat-field" data-field="name" style="display: none;">
            <label for="prechat-name">{{NAME_LABEL}}</label>
            <input type="text" id="prechat-name" placeholder="{{NAME_PLACEHOLDER}}" required />
          </div>
          <div class="prechat-field" data-field="email" style="display: none;">
            <label for="prechat-email">{{EMAIL_LABEL}}</label>
            <input type="email" id="prechat-email" placeholder="{{EMAIL_PLACEHOLDER}}" required />
          </div>
          <div class="prechat-field" data-field="phone" style="display: none;">
            <label for="prechat-phone">{{PHONE_LABEL}}</label>
            <input type="tel" id="prechat-phone" placeholder="{{PHONE_PLACEHOLDER}}" />
          </div>
          <div id="prechat-custom-fields"></div>
          <button id="prechat-submit" class="prechat-submit-btn">{{LIVE_CHAT_BUTTON_TEXT}}</button>
        </div>
      </div>
      
      <!-- Chat messages -->
      <div id="lovable-livechat-messages" style="display: none;"></div>
      <div id="lovable-livechat-input-area" style="display: none;">
        <input type="text" id="lovable-livechat-input" placeholder="Type your message..." />
        <button id="lovable-livechat-send">Send</button>
      </div>
    </div>
  </div>
</div>
`;
