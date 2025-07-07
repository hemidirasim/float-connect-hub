
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
    {{VIDEO_CONTENT}}
    {{LIVE_CHAT_BUTTON}}
    <div id="lovable-widget-channels"></div>
    <div class="lovable-empty-state" style="display: none;">
      <div class="lovable-empty-icon">📱</div>
      <p>No channels configured</p>
    </div>
  </div>
</div>

<div id="lovable-livechat-modal" style="display: none; visibility: hidden; opacity: 0;">
  <div id="lovable-livechat-content">
    <div id="lovable-livechat-header">
      <h3>{{LIVE_CHAT_GREETING}}</h3>
      <button id="lovable-livechat-close">×</button>
    </div>
    <div id="lovable-livechat-messages"></div>
    <div id="lovable-livechat-input-area">
      <input type="text" id="lovable-livechat-input" placeholder="Type your message..." />
      <button id="lovable-livechat-send">Send</button>
    </div>
  </div>
</div>
`;
