
import type { TemplateConfig } from './types.ts'
import { getChannelIcon, getChannelColor, getChannelUrl } from './channel-utils.ts'

export function generateChannelsHtml(config: TemplateConfig, templateId: string): string {
  if (templateId === 'minimal') {
    // For minimal template, maintain the original order (don't reverse)
    return config.channels.map(channel => {
      const iconSvg = getChannelIcon(channel.type, channel.customIcon, true)
      const channelUrl = getChannelUrl(channel)
      const channelColor = getChannelColor(channel.type)
      
      // Calculate icon size based on button size (proportional scaling)
      const buttonSize = config.buttonSize || 60
      const iconSize = Math.max(40, Math.min(55, buttonSize * 0.83)) // Scale between 40-55px
      
      return `
        <a href="${channelUrl}" target="_blank" class="hiclient-channel-animated" style="background: ${channelColor}; width: ${iconSize}px; height: ${iconSize}px;" onclick="window.openChannel && window.openChannel('${channelUrl}')">
          ${iconSvg}
          <div class="hiclient-channel-tooltip">${channel.label}</div>
        </a>
      `
    }).join('')
  }
  
  return config.channels.map(channel => {
    const iconSvg = getChannelIcon(channel.type, channel.customIcon, false)
    const channelUrl = getChannelUrl(channel)
    const channelColor = getChannelColor(channel.type)
    
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
}

export function generateVideoContent(config: TemplateConfig): string {
  if (!config.videoEnabled || !config.videoUrl) return ''
  
  return `<div class="hiclient-video-container" style="text-align: ${config.videoAlignment}; margin-bottom: 20px;">
     <video class="hiclient-video-player" src="${config.videoUrl}" 
            style="height: ${config.videoHeight}px; width: 100%; border-radius: 12px;" 
            controls muted>
     </video>
   </div>`
}

export function generateButtonIcon(customIconUrl?: string): string {
  if (customIconUrl) {
    return `<img src="${customIconUrl}" style="width: 24px; height: 24px; object-fit: contain;" alt="Contact">`
  }
  
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
   </svg>`
}
