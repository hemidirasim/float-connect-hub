import React, { useEffect, useState } from 'react';
import { Channel, FormData } from './types';
import { TemplateRenderer, WidgetTemplate, TemplateConfig } from "@/utils/templateRenderer";

// Static template definitions (matching the edge function templates)
const TEMPLATE_DEFINITIONS: Record<string, WidgetTemplate> = {
  'default': {
    id: 'default',
    name: 'Default Template',
    description: 'Standard floating widget with modal popup',
    html_template: `
<!-- Default HTML Template -->
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
</div>`,
    css_template: `
/* Default CSS Template */
.hiclient-widget-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.hiclient-widget-button {
  width: {{button_size}}px;
  height: {{button_size}}px;
  border-radius: 50%;
  background: {{button_color}};
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.hiclient-widget-button:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hiclient-tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100000;
  transition: opacity 0.15s ease, visibility 0.15s ease;
  pointer-events: none;
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
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  {{position}} === 'left' ? 'border-left: 5px solid rgba(0, 0, 0, 0.9); right: -5px;' : 'border-right: 5px solid rgba(0, 0, 0, 0.9); left: -5px;'
}

.hiclient-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.hiclient-modal-backdrop.show {
  opacity: 1;
  visibility: visible;
}

.hiclient-modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 28rem;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.95);
  transition: transform 0.3s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
}

.hiclient-modal-backdrop.show .hiclient-modal-content {
  transform: scale(1);
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
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  line-height: 1.4;
  padding-right: 40px;
}

.hiclient-video-container {
  margin-bottom: 20px;
}

.hiclient-video-player {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.hiclient-channels-container {
  max-height: 300px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.hiclient-channel-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: white;
}

.hiclient-channel-item:hover {
  background-color: #f9fafb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.hiclient-channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hiclient-channel-info {
  flex: 1;
  min-width: 0;
}

.hiclient-channel-label {
  font-weight: 500;
  font-size: 14px;
  color: #374151;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.hiclient-channel-value {
  font-size: 12px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  line-height: 1.3;
}

.hiclient-external-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
}

.hiclient-empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.hiclient-empty-icon {
  width: 32px;
  height: 32px;
  margin: 0 auto 12px;
  opacity: 0.5;
}`,
    js_template: `/* Default JS Template - Video without autoplay sound, controls hidden */
console.log("Widget JavaScript loaded");

function initializeWidget() {
  console.log("Initializing widget...");
  
  var button = document.querySelector(".hiclient-widget-button");
  var modal = document.querySelector(".hiclient-modal-backdrop");
  var tooltip = document.querySelector(".hiclient-tooltip");
  var closeBtn = document.querySelector(".hiclient-modal-close");
  var video = document.querySelector(".hiclient-video-player");
  
  console.log("Found elements:", { button: !!button, modal: !!modal, tooltip: !!tooltip, closeBtn: !!closeBtn, video: !!video });
  
  // Ensure video is muted and paused initially
  if (video) {
    video.muted = true;
    video.pause();
    video.currentTime = 0;
    console.log("Video muted and paused on load");
  }
  
  if (button && modal) {
    // Button click handler
    button.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Widget button clicked, showing modal");
      modal.classList.add("show");
      
      // Start video with sound when modal opens
      if (video) {
        console.log("Starting video with sound");
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(function(error) {
          console.log("Video play error:", error);
        });
      }
    });
    
    // Close button handler
    if (closeBtn) {
      closeBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Close button clicked");
        closeModal();
      });
    }
    
    // Backdrop click handler
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        console.log("Backdrop clicked, closing modal");
        closeModal();
      }
    });
    
    // ESC key handler
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        console.log("ESC pressed, closing modal");
        closeModal();
      }
    });
    
    // Function to close modal and mute/pause video
    function closeModal() {
      modal.classList.remove("show");
      if (video) {
        console.log("Muting and pausing video");
        video.muted = true;
        video.pause();
      }
    }
  }
  
  // Tooltip hover effects
  if (tooltip && button) {
    button.addEventListener("mouseenter", function() {
      console.log("Button hover - showing tooltip");
      tooltip.classList.remove("hide");
      tooltip.classList.add("show");
    });
    
    button.addEventListener("mouseleave", function() {
      console.log("Button leave - hiding tooltip");
      tooltip.classList.remove("show");
      tooltip.classList.add("hide");
    });
  }
  
  // Global channel opener
  window.openChannel = function(url) {
    console.log("Opening channel:", url);
    window.open(url, "_blank");
  };
  
  console.log("Widget initialization complete");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}`,
    is_active: true,
    is_default: true
  },
  'dark': {
    id: 'dark',
    name: 'Dark Theme',
    description: 'Modern dark-themed widget with sleek design',
    html_template: `
<!-- Dark Theme Template -->
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
</div>`,
    css_template: `/* Dark theme styles will be applied */`,
    js_template: `/* Dark theme JS */`,
    is_active: true,
    is_default: false
  },
  'minimal': {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean and minimal design with subtle animations',
    html_template: `
<!-- Minimal Template -->
<div class="hiclient-widget-container" style="position: fixed; {{position}}: 20px; bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip {{tooltip_class}}" style="{{tooltip_style}}">{{tooltip_text}}</div>
  <button class="hiclient-widget-button" style="{{button_style}}">
    {{button_icon}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">Contact Us</div>
    <div class="hiclient-modal-close">×</div>
    {{video_section}}
    {{channels_section}}
    {{empty_state}}
  </div>
</div>`,
    css_template: `/* Minimal styles */`,
    js_template: `/* Minimal JS */`,
    is_active: true,
    is_default: false
  },
  'modern': {
    id: 'modern',
    name: 'Modern Gradient',
    description: 'Modern template with gradient effects and smooth animations',
    html_template: `
<!-- Modern Template -->
<div class="hiclient-widget-container" style="position: fixed; {{position}}: 20px; bottom: 20px; z-index: 99999;">
  <div class="hiclient-tooltip {{tooltip_class}}" style="{{tooltip_style}}">{{tooltip_text}}</div>
  <button class="hiclient-widget-button" style="{{button_style}}">
    {{button_icon}}
  </button>
</div>

<div class="hiclient-modal-backdrop">
  <div class="hiclient-modal-content">
    <div class="hiclient-modal-header">Get in Touch</div>
    <div class="hiclient-modal-close">×</div>
    {{video_section}}
    {{channels_section}}
    {{empty_state}}
  </div>
</div>`,
    css_template: `/* Modern gradient styles */`,
    js_template: `/* Modern JS */`,
    is_active: true,
    is_default: false
  }
};

interface TemplatePreviewProps {
  showWidget: boolean;
  formData: FormData;
  channels: Channel[];
  editingWidget?: any;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  showWidget,
  formData,
  channels,
  editingWidget
}) => {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Get template from static definitions
  const getTemplate = (templateId: string): WidgetTemplate => {
    const template = TEMPLATE_DEFINITIONS[templateId] || TEMPLATE_DEFINITIONS['default'];
    setDebugInfo(`Using template: ${template.name} (file-based)`);
    return template;
  };

  // Generate preview HTML when template or config changes
  useEffect(() => {
    if (!showWidget) {
      setPreviewHtml('');
      return;
    }

    const templateId = formData.templateId || 'default';
    const template = getTemplate(templateId);

    console.log('Generating preview with:', {
      templateId,
      templateName: template.name,
      channels: channels.length,
      buttonColor: formData.buttonColor,
      position: formData.position
    });

    const config: TemplateConfig = {
      channels,
      buttonColor: formData.buttonColor,
      position: formData.position,
      tooltip: formData.tooltip,
      tooltipDisplay: formData.tooltipDisplay,
      customIconUrl: formData.customIconUrl,
      videoEnabled: Boolean(formData.videoUrl),
      videoUrl: formData.videoUrl || editingWidget?.video_url,
      videoHeight: formData.videoHeight,
      videoAlignment: formData.videoAlignment,
      useVideoPreview: formData.useVideoPreview,
      buttonSize: formData.buttonSize,
      previewVideoHeight: formData.previewVideoHeight
    };

    const renderer = new TemplateRenderer(template, config);
    const html = renderer.renderComplete();
    setPreviewHtml(html);
    setDebugInfo(`Preview generated: ${template.name} (${channels.length} channels)`);
    console.log('Preview HTML generated:', html.length, 'characters');
  }, [formData, channels, showWidget, editingWidget]);

  // Execute inline scripts after HTML is inserted
  useEffect(() => {
    if (previewHtml) {
      const timer = setTimeout(() => {
        try {
          const previewContainer = document.querySelector('[data-preview-container]');
          if (previewContainer) {
            const scripts = previewContainer.querySelectorAll('script');
            scripts.forEach(script => {
              if (script.textContent) {
                console.log('Executing preview script...');
                try {
                  eval(script.textContent);
                } catch (e) {
                  console.error('Script execution error:', e);
                }
              }
            });
          }
        } catch (error) {
          console.error('Error executing preview scripts:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [previewHtml]);

  if (!showWidget) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <p>Your website preview</p>
        <p className="text-sm">Widget appears below</p>
        {formData.templateId && (
          <p className="text-xs mt-2 text-purple-600">
            Template: {TEMPLATE_DEFINITIONS[formData.templateId]?.name || 'Default'}
          </p>
        )}
        <p className="text-xs mt-2 text-blue-600">{debugInfo}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">🌐</span>
          </div>
          <p>Your website preview</p>
          <p className="text-xs mt-2 text-purple-600">
            Template: {TEMPLATE_DEFINITIONS[formData.templateId || 'default']?.name || 'Default'}
          </p>
          <p className="text-xs mt-1 text-blue-600">{debugInfo}</p>
        </div>
      </div>
      
      {/* Template rendered widget */}
      <div 
        className="absolute inset-0"
        data-preview-container
        dangerouslySetInnerHTML={{ __html: previewHtml }}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};
