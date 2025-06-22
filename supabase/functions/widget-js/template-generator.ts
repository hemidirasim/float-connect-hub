
import type { WidgetTemplate } from './template-types.ts'
import type { TemplateConfig } from './renderer/types.ts'
import { getPositionStyle, getTooltipPositionStyle } from './renderer/position-utils.ts'
import { generateChannelsHtml, generateVideoContent, generateButtonIcon } from './renderer/content-generators.ts'

// Re-export the TemplateConfig type for backward compatibility
export type { TemplateConfig }

export class WidgetTemplateRenderer {
  constructor(private template: WidgetTemplate, private config: TemplateConfig) {}

  generateWidgetScript(): string {
    console.log('Generating widget script for template:', this.template.id)
    
    let html = this.template.html
    let css = this.template.css
    let js = this.template.js

    // Generate content
    const channelsHtml = generateChannelsHtml(this.config, this.template.id)
    const videoContent = generateVideoContent(this.config)
    const buttonIcon = generateButtonIcon(this.config.customIconUrl)

    // Replace placeholders
    const replacements = {
      '{{POSITION_STYLE}}': getPositionStyle(this.config.position),
      '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(this.config),
      '{{BUTTON_COLOR}}': this.config.buttonColor,
      '{{BUTTON_SIZE}}': (this.config.buttonSize || 60).toString(),
      '{{TOOLTIP_TEXT}}': this.config.tooltip,
      '{{TOOLTIP_DISPLAY}}': this.config.tooltipDisplay,
      '{{TOOLTIP_POSITION}}': this.config.tooltipPosition || 'top',
      '{{GREETING_MESSAGE}}': this.config.greetingMessage || 'Hi 👋\nHow can we help you today?',
      '{{BUTTON_ICON}}': buttonIcon,
      '{{CHANNELS_HTML}}': channelsHtml,
      '{{VIDEO_CONTENT}}': videoContent,
      '{{CHANNELS_COUNT}}': this.config.channels.length.toString(),
      '{{POSITION}}': this.config.position
    }

    // Apply replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g')
      html = html.replace(regex, value)
      css = css.replace(regex, value)
      js = js.replace(regex, value)
    })

    // Add global function for channel clicks
    const globalScript = `
    window.openChannel = function(url) {
      window.open(url, '_blank');
    };
    `

    // Generate complete script
    return `
(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = \`${css}\`;
  document.head.appendChild(style);

  // Inject HTML
  const widgetDiv = document.createElement('div');
  widgetDiv.innerHTML = \`${html}\`;
  document.body.appendChild(widgetDiv);

  // Add global functions
  ${globalScript}

  // Execute JavaScript
  ${js}
})();
`
  }
}
