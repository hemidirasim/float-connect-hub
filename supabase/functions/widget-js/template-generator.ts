
import type { WidgetTemplate } from './template-types.ts'
import type { TemplateConfig } from './renderer/types.ts'
import { getPositionStyle, getTooltipPositionStyle } from './renderer/position-utils.ts'
import { generateVideoContent, generateButtonIcon } from './renderer/content-generators.ts'

// Re-export the TemplateConfig type for backward compatibility
export type { TemplateConfig }

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

    // Template-specific channel generation - each template handles its own channels
    const channelsHtml = this.generateTemplateSpecificChannels()

    // Calculate responsive values
    const buttonSize = this.config.buttonSize || 60
    const iconSize = Math.max(40, Math.min(55, buttonSize * 0.83))
    const channelGap = Math.max(8, Math.min(12, buttonSize * 0.15))
    const channelBottomOffset = buttonSize + 15
    const tooltipRightOffset = iconSize + 10
    const mobileChannelGap = Math.max(6, channelGap - 2)
    const mobileTooltipRightOffset = Math.max(50, tooltipRightOffset - 5)

    // Replace placeholders
    const replacements = {
      '{{POSITION_STYLE}}': getPositionStyle(this.config.position),
      '{{TOOLTIP_POSITION_STYLE}}': getTooltipPositionStyle(this.config),
      '{{BUTTON_COLOR}}': this.config.buttonColor,
      '{{BUTTON_SIZE}}': buttonSize.toString(),
      '{{TOOLTIP_TEXT}}': this.config.tooltip,
      '{{TOOLTIP_DISPLAY}}': this.config.tooltipDisplay,
      '{{TOOLTIP_POSITION}}': this.config.tooltipPosition || 'top',
      '{{GREETING_MESSAGE}}': this.config.greetingMessage || 'Hi 👋\nHow can we help you today?',
      '{{BUTTON_ICON}}': buttonIcon,
      '{{CHANNELS_HTML}}': channelsHtml,
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

  private generateTemplateSpecificChannels(): string {
    // Each template now handles its own channel generation
    switch (this.template.id) {
      case 'modern':
        return this.generateModernChannels()
      case 'elegant':
        return this.generateElegantChannels()
      case 'minimal':
        return this.generateMinimalChannels()
      case 'dark':
        return this.generateDarkChannels()
      default:
        return this.generateDefaultChannels()
    }
  }

  private generateModernChannels(): string {
    return this.config.channels.map(channel => {
      const channelUrl = this.getChannelUrl(channel)
      const channelIcon = this.getChannelIcon(channel)
      const channelColor = this.getChannelColor(channel.type)
      
      return `
        <div class="hiclient-channel-item" data-type="${channel.type}">
          <button class="hiclient-channel-btn" onclick="window.openChannel('${channelUrl}')" style="background: ${channelColor};">
            ${channelIcon}
            <span class="hiclient-channel-label">${channel.label}</span>
          </button>
        </div>
      `
    }).join('')
  }

  private generateElegantChannels(): string {
    return this.config.channels.map(channel => {
      const channelUrl = this.getChannelUrl(channel)
      const channelIcon = this.getChannelIcon(channel)
      const channelColor = this.getChannelColor(channel.type)
      
      return `
        <a href="${channelUrl}" target="_blank" class="lovable-channel-button" onclick="window.openChannel('${channelUrl}')" style="border-color: ${channelColor};">
          <div class="lovable-channel-icon" style="color: ${channelColor};">${channelIcon}</div>
          <span>${channel.label}</span>
        </a>
      `
    }).join('')
  }

  private generateMinimalChannels(): string {
    return this.config.channels.map(channel => {
      const channelUrl = this.getChannelUrl(channel)
      const channelIcon = this.getChannelIcon(channel)
      const channelColor = this.getChannelColor(channel.type)
      
      return `
        <a href="${channelUrl}" target="_blank" class="widget-channel-btn" data-type="${channel.type}" onclick="window.openChannel('${channelUrl}')" style="background: ${channelColor};">
          ${channelIcon}
        </a>
      `
    }).reverse().join('')
  }

  private generateDarkChannels(): string {
    return this.config.channels.map(channel => {
      const channelUrl = this.getChannelUrl(channel)
      const channelIcon = this.getChannelIcon(channel)
      const channelColor = this.getChannelColor(channel.type)
      
      return `
        <a href="${channelUrl}" target="_blank" class="dark-channel-button" onclick="window.openChannel('${channelUrl}')" style="background: ${channelColor};">
          <div class="dark-channel-icon">${channelIcon}</div>
          <span class="dark-channel-label">${channel.label}</span>
        </a>
      `
    }).join('')
  }

  private generateDefaultChannels(): string {
    return this.config.channels.map(channel => {
      const channelUrl = this.getChannelUrl(channel)
      const channelIcon = this.getChannelIcon(channel)
      const channelColor = this.getChannelColor(channel.type)
      
      return `
        <a href="${channelUrl}" target="_blank" class="lovable-channel-button" onclick="window.openChannel('${channelUrl}')">
          <div class="lovable-channel-icon" style="background: ${channelColor}; color: white;">${channelIcon}</div>
          <div class="lovable-channel-info">
            <div class="lovable-channel-label">${channel.label}</div>
            <div class="lovable-channel-value">${channel.value}</div>
          </div>
          <div class="lovable-channel-arrow">→</div>
        </a>
      `
    }).join('')
  }

  private getChannelUrl(channel: any): string {
    switch (channel.type) {
      case 'whatsapp':
        return `https://wa.me/${channel.value.replace(/\D/g, '')}`
      case 'telegram':
        return channel.value.startsWith('http') ? channel.value : `https://t.me/${channel.value}`
      case 'phone':
        return `tel:${channel.value}`
      case 'email':
        return `mailto:${channel.value}`
      case 'instagram':
        return channel.value.startsWith('http') ? channel.value : `https://instagram.com/${channel.value}`
      case 'facebook':
        return channel.value.startsWith('http') ? channel.value : `https://facebook.com/${channel.value}`
      case 'linkedin':
        return channel.value.startsWith('http') ? channel.value : `https://linkedin.com/in/${channel.value}`
      case 'twitter':
        return channel.value.startsWith('http') ? channel.value : `https://twitter.com/${channel.value}`
      case 'youtube':
        return channel.value.startsWith('http') ? channel.value : `https://youtube.com/${channel.value}`
      case 'tiktok':
        return channel.value.startsWith('http') ? channel.value : `https://tiktok.com/@${channel.value}`
      case 'snapchat':
        return channel.value.startsWith('http') ? channel.value : `https://snapchat.com/add/${channel.value}`
      case 'discord':
        return channel.value.startsWith('http') ? channel.value : `https://discord.gg/${channel.value}`
      case 'skype':
        return `skype:${channel.value}?chat`
      case 'viber':
        return `viber://contact?number=${channel.value}`
      case 'line':
        return `https://line.me/ti/p/${channel.value}`
      case 'wechat':
        return `weixin://dl/chat?${channel.value}`
      default:
        return channel.value.startsWith('http') ? channel.value : `https://${channel.value}`
    }
  }

  private getChannelIcon(channel: any): string {
    if (channel.customIcon) {
      return `<img src="${channel.customIcon}" style="width: 20px; height: 20px;" alt="${channel.type}">`
    }

    switch (channel.type) {
      case 'whatsapp':
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>'
      case 'telegram':
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
      case 'phone':
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>'
      case 'email':
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
      case 'instagram':
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
      case 'facebook':
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
      default:
        return '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
    }
  }

  private getChannelColor(type: string): string {
    switch (type) {
      case 'whatsapp': return '#25D366'
      case 'telegram': return '#0088CC'
      case 'phone': return '#34C759'
      case 'email': return '#007AFF'
      case 'instagram': return '#E4405F'
      case 'facebook': return '#1877F2'
      case 'linkedin': return '#0077B5'
      case 'twitter': return '#1DA1F2'
      case 'youtube': return '#FF0000'
      case 'tiktok': return '#000000'
      case 'snapchat': return '#FFFC00'
      case 'discord': return '#5865F2'
      case 'skype': return '#00AFF0'
      case 'viber': return '#665CAC'
      case 'line': return '#00C300'
      case 'wechat': return '#7BB32E'
      default: return '#6B7280'
    }
  }
}
