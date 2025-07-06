
import type { WidgetTemplate } from './template-types.ts'
import type { TemplateConfig } from './renderer/types.ts'
import { getPositionStyle, getTooltipPositionStyle, getModalPositionStyle, getModalContentPositionStyle, getButtonOffsetStyle } from './renderer/position-utils.ts'
import { generateVideoContent, generateButtonIcon } from './renderer/content-generators.ts'

export type { TemplateConfig }

// Utility function to escape special characters for JavaScript string literals
function escapeJavaScriptString(str: string): string {
  if (!str) return str;
  
  return str
    .replace(/\\/g, '\\\\')    // Escape backslashes first
    .replace(/'/g, "\\'")      // Escape single quotes
    .replace(/"/g, '\\"')      // Escape double quotes
    .replace(/`/g, '\\`')      // Escape backticks
    .replace(/\n/g, '\\n')     // Escape newlines
    .replace(/\r/g, '\\r')     // Escape carriage returns
    .replace(/\t/g, '\\t');    // Escape tabs
}

// Utility function to escape content for template literals
function escapeTemplateContent(content: string): string {
  if (!content) return content;
  
  return content
    .replace(/\\/g, '\\\\')    // Escape backslashes
    .replace(/`/g, '\\`')      // Escape backticks
    .replace(/\${/g, '\\${');  // Escape template literal expressions
}

// Better string replacement that handles quotes properly
function safeStringReplace(template: string, placeholder: string, value: string): string {
  const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g')
  // If the value contains quotes, make sure they're properly escaped for JavaScript context
  const safeValue = typeof value === 'string' ? escapeJavaScriptString(value) : String(value)
  return template.replace(regex, safeValue)
}

export class WidgetTemplateRenderer {
  constructor(private template: WidgetTemplate, private config: TemplateConfig) {}

  generateWidgetScript(): string {
    console.log('Generating widget script for template:', this.template.id)
    console.log('Template config for video:', {
      videoEnabled: this.config.videoEnabled,
      videoUrl: this.config.videoUrl,
      videoHeight: this.config.videoHeight,
      useVideoPreview: this.config.useVideoPreview,
      previewVideoHeight: this.config.previewVideoHeight
    })
    
    let html = this.template.html
    let css = this.template.css
    let js = this.template.js

    // Generate common content (video, button icon) - Make sure video is generated
    const videoContent = generateVideoContent(this.config)
    const buttonIcon = generateButtonIcon(this.config.customIconUrl, this.config.useVideoPreview, this.config.videoUrl, this.config.previewVideoHeight)

    console.log('Generated video content for template:', videoContent ? 'YES' : 'NO')
    console.log('Video content length:', videoContent.length)
    console.log('Using video preview as button:', this.config.useVideoPreview)

    // Calculate responsive values
    const buttonSize = this.config.useVideoPreview ? (this.config.previewVideoHeight || 120) : (this.config.buttonSize || 60)
    const iconSize = Math.max(40, Math.min(55, buttonSize * 0.83))
    const channelGap = Math.max(8, Math.min(12, buttonSize * 0.15))
    const channelBottomOffset = buttonSize + 15
    const tooltipRightOffset = iconSize + 10
    const mobileChannelGap = Math.max(6, channelGap - 2)
    const mobileTooltipRightOffset = Math.max(50, tooltipRightOffset - 5)

    // Create replacements object with properly escaped values
    const replacements = {
      '{{POSITION_STYLE}}': getPositionStyle(this.config.position),
      '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(this.config),
      '{{BUTTON_OFFSET_STYLE}}': getButtonOffsetStyle(this.config),
      '{{MODAL_ALIGNMENT}}': getModalPositionStyle(this.config.position),
      '{{MODAL_CONTENT_POSITION}}': getModalContentPositionStyle(this.config.position),
      '{{BUTTON_COLOR}}': this.config.buttonColor,
      '{{BUTTON_SIZE}}': buttonSize.toString(),
      '{{TOOLTIP_TEXT}}': this.config.tooltip || '',
      '{{TOOLTIP_DISPLAY}}': this.config.tooltipDisplay,
      '{{TOOLTIP_POSITION}}': this.config.tooltipPosition || 'top',
      '{{GREETING_MESSAGE}}': this.config.greetingMessage || 'Hi 👋\\nHow can we help you today?',
      '{{BUTTON_ICON}}': buttonIcon,
      '{{CHANNELS_DATA}}': JSON.stringify(this.config.channels),
      '{{VIDEO_CONTENT}}': videoContent, // Make sure this is included
      '{{CHANNELS_COUNT}}': this.config.channels.length.toString(),
      '{{POSITION}}': this.config.position,
      '{{CHANNEL_GAP}}': channelGap.toString(),
      '{{CHANNEL_BOTTOM_OFFSET}}': channelBottomOffset.toString(),
      '{{TOOLTIP_RIGHT_OFFSET}}': tooltipRightOffset.toString(),
      '{{MOBILE_CHANNEL_GAP}}': mobileChannelGap.toString(),
      '{{MOBILE_TOOLTIP_RIGHT_OFFSET}}': mobileTooltipRightOffset.toString()
    }

    console.log('Video content in replacements:', replacements['{{VIDEO_CONTENT}}'] ? 'YES' : 'NO')
    console.log('Button icon type:', this.config.useVideoPreview ? 'VIDEO_PREVIEW' : 'STANDARD_ICON')

    // Apply replacements with safe string handling
    Object.entries(replacements).forEach(([placeholder, value]) => {
      if (placeholder === '{{GREETING_MESSAGE}}' || placeholder === '{{TOOLTIP_TEXT}}') {
        // These are used in JavaScript strings, so escape them properly
        html = safeStringReplace(html, placeholder, value)
        css = safeStringReplace(css, placeholder, value)
        js = safeStringReplace(js, placeholder, value)
      } else {
        // Regular replacement for other values
        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g')
        html = html.replace(regex, value)
        css = css.replace(regex, value)
        js = js.replace(regex, value)
      }
    })

    console.log('Final HTML contains video:', html.includes('hiclient-video') ? 'YES' : 'NO')

    // Escape content for template literals to prevent syntax errors
    const escapedHtml = escapeTemplateContent(html)
    const escapedCss = escapeTemplateContent(css)
    const escapedJs = escapeTemplateContent(js)

    // Video URL yükləmə funksiyası
    const videoUrlLoaderScript = `
    // Təhlükəsiz video URL yükləmə funksiyası
    async function loadSecureVideoUrl(videoElement) {
      const videoUrl = videoElement.getAttribute('data-video-url');
      if (!videoUrl) return;
      
      try {
        // Əgər Supabase Storage URL-dirsə, signed URL al
        if (videoUrl.includes('supabase') && videoUrl.includes('/storage/')) {
          const urlParts = videoUrl.split('/storage/v1/object/public/videos/');
          if (urlParts.length > 1) {
            const videoPath = urlParts[1];
            
            const response = await fetch('${Deno.env.get('SUPABASE_URL')}/functions/v1/get-video-url', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ videoPath })
            });
            
            if (response.ok) {
              const data = await response.json();
              videoElement.src = data.signedUrl;
              return;
            }
          }
        }
        
        // Fallback - orijinal URL-i istifadə et
        videoElement.src = videoUrl;
      } catch (error) {
        console.error('Video URL yükləmə xətası:', error);
        videoElement.src = videoUrl; // Fallback
      }
    }
    
    // Bütün video elementləri üçün URL-ləri yüklə
    function initializeVideoElements() {
      const videoElements = document.querySelectorAll('video[data-video-url]');
      videoElements.forEach(loadSecureVideoUrl);
    }
    `

    // Add global function for channel clicks
    const globalScript = `
    window.openChannel = function(url) {
      window.open(url, '_blank');
    };
    
    ${videoUrlLoaderScript}
    `

    // Generate complete script using properly escaped content
    const finalScript = `
(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = \`${escapedCss}\`;
  document.head.appendChild(style);

  // Inject HTML
  const widgetDiv = document.createElement('div');
  widgetDiv.innerHTML = \`${escapedHtml}\`;
  document.body.appendChild(widgetDiv);

  // Add global functions
  ${globalScript}

  // Execute JavaScript
  ${escapedJs}

  // Video elementlərini işə sal
  setTimeout(initializeVideoElements, 100);
})();
`

    console.log('Final script contains video references:', finalScript.includes('hiclient-video') ? 'YES' : 'NO')
    return finalScript
  }
}
