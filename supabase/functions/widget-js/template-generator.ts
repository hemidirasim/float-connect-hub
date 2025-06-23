import type { WidgetTemplate } from './template-types.ts'
import type { TemplateConfig } from './renderer/types.ts'
import { getPositionStyle, getTooltipPositionStyle } from './renderer/position-utils.ts'
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

export class WidgetTemplateRenderer {
  constructor(private template: WidgetTemplate, private config: TemplateConfig) {}

  generateWidgetScript(): string {
    console.log('Generating widget script for template:', this.template.id)
    
    let html = this.template.html
    let css = this.template.css
    let js = this.template.js

    // Generate common content (video, button icon)
    const videoContent = generateVideoContent(this.config)
    const buttonIcon = generateButtonIcon(this.config.customIconUrl)

    // Calculate responsive values
    const buttonSize = this.config.buttonSize || 60
    const iconSize = Math.max(40, Math.min(55, buttonSize * 0.83))
    const channelGap = Math.max(8, Math.min(12, buttonSize * 0.15))
    const channelBottomOffset = buttonSize + 15
    const tooltipRightOffset = iconSize + 10
    const mobileChannelGap = Math.max(6, channelGap - 2)
    const mobileTooltipRightOffset = Math.max(50, tooltipRightOffset - 5)

    // Escape user input values that will be used in JavaScript strings
    const escapedTooltip = escapeJavaScriptString(this.config.tooltip || '')
    const escapedGreetingMessage = escapeJavaScriptString(this.config.greetingMessage || 'Hi 👋\\nHow can we help you today?')

    // Replace placeholders - templates now generate their own channels
    const replacements = {
      '{{POSITION_STYLE}}': getPositionStyle(this.config.position),
      '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(this.config),
      '{{BUTTON_COLOR}}': this.config.buttonColor,
      '{{BUTTON_SIZE}}': buttonSize.toString(),
      '{{TOOLTIP_TEXT}}': escapedTooltip,
      '{{TOOLTIP_DISPLAY}}': this.config.tooltipDisplay,
      '{{TOOLTIP_POSITION}}': this.config.tooltipPosition || 'top',
      '{{GREETING_MESSAGE}}': escapedGreetingMessage,
      '{{BUTTON_ICON}}': buttonIcon,
      '{{CHANNELS_DATA}}': JSON.stringify(this.config.channels), // Pass channel data to templates
      '{{VIDEO_CONTENT}}': videoContent,
      '{{CHANNELS_COUNT}}': this.config.channels.length.toString(),
      '{{POSITION}}': this.config.position,
      '{{CHANNEL_GAP}}': channelGap.toString(),
      '{{CHANNEL_BOTTOM_OFFSET}}': channelBottomOffset.toString(),
      '{{TOOLTIP_RIGHT_OFFSET}}': tooltipRightOffset.toString(),
      '{{MOBILE_CHANNEL_GAP}}': mobileChannelGap.toString(),
      '{{MOBILE_TOOLTIP_RIGHT_OFFSET}}': mobileTooltipRightOffset.toString()
    }

    // Apply replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g')
      html = html.replace(regex, value)
      css = css.replace(regex, value)
      js = js.replace(regex, value)
    })

    // Escape content for template literals to prevent syntax errors
    const escapedHtml = escapeTemplateContent(html)
    const escapedCss = escapeTemplateContent(css)
    const escapedJs = escapeTemplateContent(js)

    // Add global function for channel clicks
    const globalScript = `
    window.openChannel = function(url) {
      window.open(url, '_blank');
    };
    `

    // Generate complete script using properly escaped content
    return `
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
})();
`
  }
}