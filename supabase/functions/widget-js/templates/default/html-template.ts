
export const htmlTemplate = `
<div id="hiclient-widget" class="hiclient-widget" style="{{POSITION_STYLE}}">
  <div class="hiclient-button-container">
    <button id="hiclient-button" class="hiclient-button" style="{{BUTTON_OFFSET_STYLE}} background-color: {{BUTTON_COLOR}}; width: {{BUTTON_SIZE}}px; height: {{BUTTON_SIZE}}px; {{VIDEO_BUTTON_STYLE}}" onclick="showModal()">
      {{BUTTON_ICON}}
    </button>
    
    <div id="hiclient-tooltip" class="hiclient-tooltip" style="{{TOOLTIP_POSITION_STYLE}} display: {{TOOLTIP_DISPLAY}};">
      {{TOOLTIP_TEXT}}
    </div>
  </div>
</div>

<div id="hiclient-modal" class="hiclient-modal" style="display: none; {{MODAL_ALIGNMENT}}">
  <div class="hiclient-modal-content" style="{{MODAL_CONTENT_POSITION}}">
    <span class="hiclient-close" onclick="hideModal()">&times;</span>
    
    <div class="hiclient-greeting">
      <p>{{GREETING_MESSAGE}}</p>
    </div>
    
    {{VIDEO_CONTENT}}
    
    <div class="hiclient-channels">
      <div id="hiclient-channels-container"></div>
    </div>
  </div>
  
  <div class="hiclient-modal-backdrop" onclick="console.log('Modal backdrop clicked'); hideModal();"></div>
</div>
`;
