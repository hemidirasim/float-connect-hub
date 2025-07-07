
export const defaultHtmlTemplate = `
<div id="lovable-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 25px; z-index: 99999;">
  <div id="lovable-widget-relative-container" style="position: relative;">
    <div id="lovable-widget-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
    <button id="lovable-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background: linear-gradient(135deg, {{BUTTON_COLOR}}, #16a34a); {{BUTTON_OFFSET_STYLE}}">
      <div class="button-content">
        {{BUTTON_ICON}}
        <div class="pulse-ring"></div>
        <div class="pulse-ring-2"></div>
      </div>
    </button>
  </div>
</div>

<div id="lovable-widget-modal" style="display: none; visibility: hidden; opacity: 0;">
  <div id="lovable-modal-backdrop"></div>
  <div id="lovable-modal-content" style="transform: translateY(30px) scale(0.95);">
    <div id="lovable-modal-header">
      <div class="header-gradient"></div>
      <div class="header-content">
        <div class="greeting-text">{{GREETING_MESSAGE}}</div>
        <button id="lovable-widget-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="modal-body">
      <div style="position: relative; z-index: 1;">
        {{VIDEO_CONTENT}}
      </div>
      
      {{LIVE_CHAT_BUTTON}}
      
      <div id="lovable-widget-channels" class="channels-container"></div>
      
      <div class="lovable-empty-state" style="display: none;">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        </div>
        <h3>Əlaqə kanalı yoxdur</h3>
        <p>Hələ ki heç bir əlaqə kanalı əlavə edilməyib</p>
      </div>
    </div>
    
    <!-- Live chat content inside main modal -->
    <div id="lovable-livechat-content" style="display: none;">
      <div id="lovable-livechat-header">
        <h3>{{LIVE_CHAT_GREETING}}</h3>
        <div class="livechat-controls">
          <button id="lovable-livechat-back">← Geri</button>
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
        <input type="text" id="lovable-livechat-input" placeholder="Mesajınızı yazın..." />
        <button id="lovable-livechat-send">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
`;
