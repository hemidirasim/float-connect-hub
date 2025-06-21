
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
      const channelUrl = this.getChannelUrl(channel)
      const channelColor = this.getChannelColor(channel.type)
      
      return `
        <a href="${channelUrl}" target="_blank" class="hiclient-channel-item" onclick="window.openChannel('${channelUrl}')">
          <div class="hiclient-channel-icon" style="background: ${channelColor}; color: white;">${iconSvg}</div>
          <div class="hiclient-channel-info">
            <div class="hiclient-channel-label">${channel.label}</div>
            <div class="hiclient-channel-value">${channel.value}</div>
          </div>
          <div class="hiclient-external-icon">→</div>
        </a>
      `
    }).join('')

    // Generate video content
    const videoContent = this.config.videoEnabled && this.config.videoUrl
      ? `<div class="hiclient-video-container" style="text-align: ${this.config.videoAlignment};">
           <video class="hiclient-video-player" src="${this.config.videoUrl}" 
                  style="height: ${this.config.videoHeight}px;" 
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
      '{{TOOLTIP_POSITION}}': this.config.tooltipPosition || 'top',
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

  getChannelColor(channelType: string): string {
    switch (channelType) {
      case 'whatsapp':
        return '#25D366'
      case 'telegram':
        return '#0088cc'
      case 'phone':
        return '#34D399'
      case 'mail':
        return '#6B7280'
      default:
        return '#6B7280'
    }
  }

  getChannelIcon(channelType: string): string {
    switch (channelType) {
      case 'whatsapp':
        return '📱'
      case 'telegram':
        return '✈️'
      case 'phone':
        return '📞'
      case 'mail':
        return '📧'
      default:
        return '💬'
    }
  }

  getChannelUrl(channel: any): string {
    switch (channel.type) {
      case 'whatsapp':
        return `https://wa.me/${channel.value.replace(/[^0-9]/g, '')}`
      case 'telegram':
        return `https://t.me/${channel.value.replace('@', '')}`
      case 'phone':
        return `tel:${channel.value}`
      case 'mail':
        return `mailto:${channel.value}`
      default:
        return '#'
    }
  }

  getDefaultIcon(): string {
    return '💬'
  }
}
