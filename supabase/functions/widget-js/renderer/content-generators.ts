import type { TemplateConfig } from './types.ts'
import { getChannelIcon, getChannelColor, getChannelUrl } from './channel-utils.ts'

export function generateChannelsHtml(config: TemplateConfig, templateId: string): string {
  if (templateId === 'minimal') {
    // For minimal template, maintain the original order (don't reverse)
    return config.channels.map(channel => {
      if (channel.isGroup && channel.groupItems) {
        // Generate group button with dropdown
        const iconSvg = getChannelIcon(channel.type, channel.customIcon, true)
        const channelColor = getChannelColor(channel.type)
        
        const buttonSize = config.buttonSize || 60
        const iconSize = Math.max(40, Math.min(55, buttonSize * 0.83))
        
        const groupItemsHtml = channel.groupItems.map(item => {
          const itemUrl = getChannelUrl(item)
          return `
            <a href="${itemUrl}" target="_blank" class="hiclient-group-item" onclick="window.openChannel && window.openChannel('${itemUrl}')">
              <span class="hiclient-group-item-label">${item.label}</span>
              <span class="hiclient-group-item-value">${item.value}</span>
            </a>
          `
        }).join('')
        
        return `
          <div class="hiclient-channel-group" style="width: ${iconSize}px; height: ${iconSize}px;">
            <div class="hiclient-channel-animated hiclient-group-trigger" style="background: ${channelColor}; width: ${iconSize}px; height: ${iconSize}px;">
              ${iconSvg}
              <div class="hiclient-channel-tooltip">${channel.label}</div>
              <span class="hiclient-group-count">${channel.groupItems.length}</span>
            </div>
            <div class="hiclient-group-dropdown">
              ${groupItemsHtml}
            </div>
          </div>
        `
      } else {
        // Regular individual channel
        const iconSvg = getChannelIcon(channel.type, channel.customIcon, true)
        const channelUrl = getChannelUrl(channel)
        const channelColor = getChannelColor(channel.type)
        
        const buttonSize = config.buttonSize || 60
        const iconSize = Math.max(40, Math.min(55, buttonSize * 0.83))
        
        return `
          <a href="${channelUrl}" target="_blank" class="hiclient-channel-animated" style="background: ${channelColor}; width: ${iconSize}px; height: ${iconSize}px;" onclick="window.openChannel && window.openChannel('${channelUrl}')">
            ${iconSvg}
            <div class="hiclient-channel-tooltip">${channel.label}</div>
          </a>
        `
      }
    }).join('')
  }
  
  return config.channels.map(channel => {
    if (channel.isGroup && channel.groupItems) {
      // Generate group for regular templates
      const iconSvg = getChannelIcon(channel.type, channel.customIcon, false)
      const channelColor = getChannelColor(channel.type)
      
      const groupItemsHtml = channel.groupItems.map(item => {
        const itemUrl = getChannelUrl(item)
        const itemIcon = getChannelIcon(item.type, item.customIcon, false)
        return `
          <a href="${itemUrl}" target="_blank" class="lovable-group-item" onclick="window.openChannel && window.openChannel('${itemUrl}')">
            <div class="lovable-group-item-icon">${itemIcon}</div>
            <div class="lovable-group-item-info">
              <div class="lovable-group-item-label">${item.label}</div>
              <div class="lovable-group-item-value">${item.value}</div>
            </div>
          </a>
        `
      }).join('')
      
      return `
        <div class="lovable-channel-group">
          <div class="lovable-channel-button lovable-group-trigger">
            <div class="lovable-channel-icon" style="background: ${channelColor}; color: white;">${iconSvg}</div>
            <div class="lovable-channel-info">
              <div class="lovable-channel-label">${channel.label}</div>
              <div class="lovable-channel-value">${channel.groupItems.length} seçim</div>
            </div>
            <div class="lovable-channel-arrow">→</div>
            <span class="lovable-group-count">${channel.groupItems.length}</span>
          </div>
          <div class="lovable-group-dropdown">
            ${groupItemsHtml}
          </div>
        </div>
      `
    } else {
      // Regular individual channel
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
    }
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

export function generateChannelButtons(channels: Channel[], config: TemplateConfig): string {
  console.log('Generating channel buttons for channels:', channels);
  
  if (!channels || channels.length === 0) {
    return '<p class="text-gray-500 text-sm">No channels configured</p>';
  }

  // Filter out child channels and process main channels
  const mainChannels = channels.filter(ch => !ch.parentId);
  
  return mainChannels.map(channel => {
    const hasChildren = channel.childChannels && channel.childChannels.length > 0;
    
    if (hasChildren) {
      // Generate dropdown for channels with children
      return generateChannelDropdown(channel, config);
    } else {
      // Generate single channel button
      return generateSingleChannelButton(channel, config);
    }
  }).join('');
}

function generateChannelDropdown(channel: Channel, config: TemplateConfig): string {
  const platform = getPlatformInfo(channel.type);
  const childCount = channel.childChannels?.length || 0;
  
  const dropdownId = `dropdown-${channel.id}`;
  
  return `
    <div class="widget-channel-group" data-channel-type="${channel.type}">
      <button class="widget-channel-btn widget-dropdown-btn" data-dropdown="${dropdownId}">
        <i class="${platform.icon}"></i>
        <span>${channel.label}</span>
        <span class="child-count">+${childCount}</span>
        <i class="dropdown-arrow">▼</i>
      </button>
      <div class="widget-dropdown" id="${dropdownId}" style="display: none;">
        ${generateDropdownItems(channel)}
      </div>
    </div>
  `;
}

function generateDropdownItems(channel: Channel): string {
  const platform = getPlatformInfo(channel.type);
  const allItems = [channel, ...(channel.childChannels || [])];
  
  return allItems.map((item, index) => {
    const href = generateChannelLink(item);
    const label = index === 0 ? item.label : `${item.label}`;
    
    return `
      <a href="${href}" target="_blank" class="widget-dropdown-item">
        <i class="${platform.icon}"></i>
        <span>${label}</span>
        <span class="dropdown-value">${item.value}</span>
      </a>
    `;
  }).join('');
}

function generateSingleChannelButton(channel: Channel, config: TemplateConfig): string {
  const platform = getPlatformInfo(channel.type);
  const href = generateChannelLink(channel);
  
  return `
    <a href="${href}" target="_blank" class="widget-channel-btn" data-channel-type="${channel.type}">
      <i class="${platform.icon}"></i>
      <span>${channel.label}</span>
    </a>
  `;
}
