
import type { WidgetTemplate } from './template-types.ts'
import type { Channel } from './types.ts'

export interface TemplateConfig {
  channels: Channel[]
  buttonColor: string
  position: string
  tooltip: string
  tooltipDisplay: string
  tooltipPosition?: string
  greetingMessage?: string
  customIconUrl?: string
  videoEnabled: boolean
  videoUrl?: string
  videoHeight: number
  videoAlignment: string
  useVideoPreview: boolean
  buttonSize: number
  previewVideoHeight: number
}

export class WidgetTemplateRenderer {
  constructor(private template: WidgetTemplate, private config: TemplateConfig) {}

  generateWidgetScript(): string {
    console.log('Generating widget script for template:', this.template.id)
    
    let html = this.template.html
    let css = this.template.css
    let js = this.template.js

    // Position styling - fix center positioning
    const getPositionStyle = () => {
      switch (this.config.position) {
        case 'left':
          return 'left: 20px;'
        case 'center':
          return 'left: 50%; transform: translateX(-50%);'
        case 'right':
        default:
          return 'right: 20px;'
      }
    }

    // Tooltip positioning - fix tooltip position logic
    const getTooltipPositionStyle = () => {
      const buttonSize = this.config.buttonSize || 60
      const tooltipOffset = 8
      
      switch (this.config.tooltipPosition || 'top') {
        case 'top':
          return `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
        case 'bottom':
          return `top: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-top: 0;`
        case 'left':
          return `right: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
        case 'right':
          return `left: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
        default:
          return `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
      }
    }

    // Generate channels HTML
    const channelsHtml = this.config.channels.map(channel => {
      const iconSvg = this.getChannelIcon(channel.type)
      return `
        <a href="${this.getChannelUrl(channel)}" target="_blank" class="lovable-channel-button">
          <div class="lovable-channel-icon">${iconSvg}</div>
          <span>${channel.label}</span>
        </a>
      `
    }).join('')

    // Generate video content
    const videoContent = this.config.videoEnabled && this.config.videoUrl
      ? `<div style="margin-bottom: 16px; text-align: ${this.config.videoAlignment};">
           <video src="${this.config.videoUrl}" 
                  style="width: 100%; max-width: 100%; height: ${this.config.videoHeight}px; border-radius: 8px;" 
                  controls muted>
           </video>
         </div>`
      : ''

    // Button icon
    const buttonIcon = this.config.customIconUrl 
      ? `<img src="${this.config.customIconUrl}" style="width: 24px; height: 24px;" alt="Contact">`
      : this.getDefaultIcon()

    // Replace placeholders
    const replacements = {
      '{{POSITION_STYLE}}': getPositionStyle(),
      '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(),
      '{{BUTTON_COLOR}}': this.config.buttonColor,
      '{{BUTTON_SIZE}}': (this.config.buttonSize || 60).toString(),
      '{{TOOLTIP_TEXT}}': this.config.tooltip,
      '{{TOOLTIP_DISPLAY}}': this.config.tooltipDisplay,
      '{{GREETING_MESSAGE}}': this.config.greetingMessage || 'Hello! How can we help you today?',
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

  // Execute JavaScript
  ${js}
})();
`
  }

  getChannelIcon(channelType: string): string {
    switch (channelType) {
      case 'whatsapp':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fill="currentColor" d="M.057 24l1.184-4.216a12.943 12.943 0 0 1-1.242 4.216zM14.057 3.343a8.006 8.006 0 0 0-11.244 11.348l1.185 4.215q.43 1.534 1.534 2.637L7.114 16.1a8.006 8.006 0 0 0 6.943-12.757zm0 1.441a6.577 6.577 0 0 1 5.043 10.532l-.841 3.007q-.248.885-.827 1.461l-1.131.331a6.448 6.448 0 0 1-5.354-1.577A6.587 6.587 0 0 1 7.4 9.835a6.426 6.426 0 0 1 6.657-6.492z"/></svg>'
      case 'phone':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.54 5.04 6.21 6.48l.81-.91c.17-.19.32-.42.39-.67l1.45-5.22c.06-.21.03-.45-.09-.62-.12-.18-.32-.29-.53-.29H9.28c-.21 0-.41.11-.52.3-.11.19-.15.42-.09.63l.81 2.89c.08.27.25.47.5.58zM21 19c0 1.1-.9 2-2 2h-1c-.55 0-1-.45-1-1v-3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v3c0 .55-.45 1-1 1H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v14z"/></svg>'
      case 'mail':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>'
      default:
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>'
    }
  }

  getChannelUrl(channel: any): string {
    switch (channel.type) {
      case 'whatsapp':
        return `https://wa.me/${channel.value}`
      case 'phone':
        return `tel:${channel.value}`
      case 'mail':
        return `mailto:${channel.value}`
      default:
        return '#'
    }
  }

  getDefaultIcon(): string {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>'
  }
}
