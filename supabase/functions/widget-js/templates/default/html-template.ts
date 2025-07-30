
export const defaultHtmlTemplate = `
<div id="lovable-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 40px; z-index: 99999;">
  <div id="lovable-widget-relative-container" style="position: relative;">
    <div id="lovable-widget-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: none;">{{TOOLTIP_TEXT}}</div>
    <button id="lovable-widget-button" style="width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; background-color: {{BUTTON_COLOR}}; {{BUTTON_OFFSET_STYLE}} {{VIDEO_BUTTON_STYLE}}">
      <svg id="lovable-chat-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
      <svg id="lovable-close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white; display: none;"><path d="m18 6-12 12M6 6l12 12"/></svg>
    </button>
  </div>
</div>

<div id="lovable-widget-modal" style="display: none; visibility: hidden; opacity: 0;">
  <div id="lovable-modal-content" style="transform: translateY(20px);">
    <div id="lovable-modal-header" style="text-align: left;">{{GREETING_MESSAGE}}</div>
    <button id="lovable-widget-close">×</button>
    {{VIDEO_CONTENT}}
    <div id="lovable-widget-channels"></div>
    <div id="lovable-powered-by" style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
      <a href="https://hiclient.co" target="_blank" style="color: #888; font-size: 11px; text-decoration: none; opacity: 0.7; transition: opacity 0.3s;">
        Powered by HiClient.co
      </a>
    </div>
  </div>
</div>
`;
