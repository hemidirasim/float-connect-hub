
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
      const iconSvg = this.getChannelIcon(channel.type, channel.customIcon)
      const channelUrl = this.getChannelUrl(channel)
      const channelColor = this.getChannelColor(channel.type)
      
      return `
        <a href="${channelUrl}" target="_blank" class="lovable-channel-button" onclick="window.openChannel && window.openChannel('${channelUrl}')">
          <div class="lovable-channel-icon" style="background: ${channelColor}; color: white;">${iconSvg}</div>
          <div class="lovable-channel-info">
            <div class="lovable-channel-label">${channel.label}</div>
            <div class="lovable-channel-value">${channel.value}</div>
          </div>
          <div class="lovable-channel-arrow">→</div>
        </a>
      `
    }).join('')

    // Generate video content
    const videoContent = this.config.videoEnabled && this.config.videoUrl
      ? `<div class="hiclient-video-container" style="text-align: ${this.config.videoAlignment}; margin-bottom: 20px;">
           <video class="hiclient-video-player" src="${this.config.videoUrl}" 
                  style="height: ${this.config.videoHeight}px; width: 100%; border-radius: 12px;" 
                  controls muted>
           </video>
         </div>`
      : ''

    // Button icon - Use custom icon if provided, otherwise use standard chat icon
    const buttonIcon = this.config.customIconUrl 
      ? `<img src="${this.config.customIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="Contact">`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>`

    // Replace placeholders
    const replacements = {
      '{{POSITION_STYLE}}': getPositionStyle(),
      '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(),
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

  getChannelColor(channelType: string): string {
    const colors = {
      whatsapp: '#25D366',
      telegram: '#0088cc',
      email: '#ea4335',
      phone: '#22c55e',
      instagram: '#e4405f',
      facebook: '#1877f2',
      twitter: '#1da1f2',
      linkedin: '#0077b5',
      youtube: '#ff0000',
      github: '#333333',
      tiktok: '#ff0050',
      messenger: '#0084ff',
      viber: '#665cac',
      skype: '#00aff0',
      discord: '#5865f2',
      website: '#6b7280',
      chatbot: '#8b5cf6'
    };
    return colors[channelType as keyof typeof colors] || '#6B7280'
  }

  getChannelIcon(channelType: string, customIcon?: string): string {
    // If custom icon is provided, use it
    if (customIcon) {
      return `<img src="${customIcon}" style="width: 20px; height: 20px; object-fit: contain;" alt="Custom icon">`
    }

    const icons = {
      whatsapp: '💬',
      telegram: '✈️',
      phone: '📞',
      email: '📧',
      instagram: '📷',
      facebook: '👥',
      twitter: '🐦',
      linkedin: '💼',
      youtube: '📺',
      github: '🐙',
      tiktok: '🎵',
      messenger: '💬',
      viber: '📞',
      skype: '📹',
      discord: '🎮',
      website: '🌐',
      chatbot: '🤖'
    };
    return icons[channelType as keyof typeof icons] || '💬'
  }

  getChannelUrl(channel: any): string {
    switch (channel.type) {
      case 'whatsapp':
        return `https://wa.me/${channel.value.replace(/[^0-9]/g, '')}`
      case 'telegram':
        return `https://t.me/${channel.value.replace('@', '')}`
      case 'phone':
        return `tel:${channel.value}`
      case 'email':
        return `mailto:${channel.value}`
      case 'instagram':
        return channel.value.startsWith('http') ? channel.value : `https://instagram.com/${channel.value.replace('@', '')}`
      case 'facebook':
        return channel.value.startsWith('http') ? channel.value : `https://facebook.com/${channel.value}`
      case 'twitter':
        return channel.value.startsWith('http') ? channel.value : `https://twitter.com/${channel.value.replace('@', '')}`
      case 'linkedin':
        return channel.value.startsWith('http') ? channel.value : `https://linkedin.com/in/${channel.value}`
      case 'youtube':
        return channel.value.startsWith('http') ? channel.value : `https://youtube.com/@${channel.value}`
      case 'github':
        return channel.value.startsWith('http') ? channel.value : `https://github.com/${channel.value}`
      case 'tiktok':
        return channel.value.startsWith('http') ? channel.value : `https://tiktok.com/@${channel.value}`
      case 'messenger':
        return channel.value.startsWith('http') ? channel.value : `https://m.me/${channel.value}`
      case 'viber':
        return `viber://chat?number=${channel.value.replace(/[^0-9]/g, '')}`
      case 'skype':
        return `skype:${channel.value}?chat`
      case 'discord':
        return channel.value
      case 'website':
        return channel.value.startsWith('http') ? channel.value : `https://${channel.value}`
      case 'chatbot':
        return channel.value
      default:
        return channel.value
    }
  }
}
