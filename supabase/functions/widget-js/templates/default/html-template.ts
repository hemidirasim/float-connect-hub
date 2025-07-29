
export const defaultHtmlTemplate = `
<div class="hiclient-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <button class="hiclient-widget-button" style="{{BUTTON_STYLE}}">
    {{BUTTON_ICON}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">
      <h3>{{GREETING_MESSAGE}}</h3>
    </div>
    <div class="hiclient-modal-close">×</div>
    {{VIDEO_CONTENT}}
    <div class="hiclient-channels-container">
      {{CHANNELS_HTML}}
    </div>
  </div>
</div>
`
