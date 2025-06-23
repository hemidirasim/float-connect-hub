
-- Update the default template with better design suited to the project parameters
UPDATE public.widget_templates 
SET html_template = '<!-- Default HTML Template -->
<div class="hiclient-widget-container" style="position: fixed; {{position}}: 20px; bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip {{tooltip_class}}" style="{{tooltip_style}}">{{tooltip_text}}</div>
  <button class="hiclient-widget-button" style="{{button_style}}">
    {{button_icon}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">Bizimlə əlaqə saxlayın</div>
    <div class="hiclient-modal-close">×</div>
    {{video_section}}
    {{channels_section}}
    {{empty_state}}
  </div>
</div>',

css_template = '/* Default CSS Template - Optimized for Azerbaijan market */
.hiclient-widget-container {
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", Arial, sans-serif;
}

.hiclient-widget-button {
  width: {{button_size}}px;
  height: {{button_size}}px;
  border-radius: 50%;
  background: {{button_color}};
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.hiclient-widget-button:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.hiclient-widget-button:active {
  transform: scale(0.98);
}

.hiclient-tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(17, 24, 39, 0.95);
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100000;
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hiclient-tooltip.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-tooltip.hide {
  opacity: 0;
  visibility: hidden;
}

.hiclient-tooltip::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.hiclient-tooltip[style*="right"] {
  right: calc(100% + 15px);
}

.hiclient-tooltip[style*="right"]::before {
  border-left: 6px solid rgba(17, 24, 39, 0.95);
  left: 100%;
}

.hiclient-tooltip[style*="left"] {
  left: calc(100% + 15px);
}

.hiclient-tooltip[style*="left"]::before {
  border-right: 6px solid rgba(17, 24, 39, 0.95);
  right: 100%;
}

.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(3px);
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: white;
  padding: 28px;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(20px);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1) translateY(0);
}

.hiclient-modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #9ca3af;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-weight: 300;
}

.hiclient-modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.hiclient-modal-header {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  line-height: 1.3;
  padding-right: 40px;
}

.hiclient-video-container {
  margin-bottom: 24px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hiclient-channels-container {
  max-height: 320px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: white;
}

.hiclient-channel-item:hover {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.hiclient-channel-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 600;
  font-size: 15px;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.hiclient-channel-value {
  font-size: 13px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.2;
}

.hiclient-external-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.hiclient-channel-item:hover .hiclient-external-icon {
  color: #6b7280;
}

.hiclient-empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
}

.hiclient-empty-icon {
  width: 36px;
  height: 36px;
  margin: 0 auto 16px;
  opacity: 0.6;
  color: #9ca3af;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .hiclient-modal-content {
    margin: 20px;
    width: calc(100% - 40px);
    padding: 24px 20px;
  }
  
  .hiclient-modal-header {
    font-size: 18px;
    padding-right: 32px;
  }
  
  .hiclient-channel-item {
    padding: 14px;
    gap: 12px;
  }
  
  .hiclient-channel-icon {
    width: 40px;
    height: 40px;
  }
}

/* Scrollbar styling */
.hiclient-channels-container::-webkit-scrollbar {
  width: 6px;
}

.hiclient-channels-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.hiclient-channels-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.hiclient-channels-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}'

WHERE name = 'Default Template' AND is_default = true;
