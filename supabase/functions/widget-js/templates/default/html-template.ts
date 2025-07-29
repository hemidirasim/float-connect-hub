
export const defaultHtmlTemplate = `
<div id="lovable-widget-container" style="position: fixed; {{POSITION_STYLE}} bottom: 20px; z-index: 99999;">
  <div id="lovable-widget-tooltip" style="{{TOOLTIP_STYLE}}">{{TOOLTIP_TEXT}}</div>
  <button id="lovable-widget-button" style="{{BUTTON_STYLE}}">
    {{BUTTON_ICON}}
  </button>
</div>

<div id="lovable-widget-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 100000; display: none; opacity: 0; visibility: hidden; transition: all 0.3s ease; backdrop-filter: blur(3px); align-items: center; justify-content: center;">
  <div id="lovable-modal-content" style="background: white; padding: 28px; border-radius: 16px; max-width: 420px; width: 90%; max-height: 85vh; overflow-y: auto; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); position: relative;">
    <div style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #111827; text-align: center; line-height: 1.3; padding-right: 40px;">
      <h3>{{GREETING_MESSAGE}}</h3>
    </div>
    <div id="lovable-widget-close" style="position: absolute; top: 16px; right: 20px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 24px; color: #9ca3af; border-radius: 50%; transition: all 0.2s ease; font-weight: 300;">×</div>
    {{VIDEO_CONTENT}}
    <div id="lovable-widget-channels" style="max-height: 320px; overflow-y: auto; display: grid; grid-template-columns: 1fr; gap: 10px;">
    </div>
    <div class="lovable-empty-state" style="text-align: center; padding: 48px 24px; color: #6b7280; display: none;">
      <div style="width: 36px; height: 36px; margin: 0 auto 16px; opacity: 0.6; color: #9ca3af;">📱</div>
      <p>Heç bir kanal əlavə edilməyib</p>
    </div>
  </div>
</div>
`
