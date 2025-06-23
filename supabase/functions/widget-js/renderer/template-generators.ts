import type { TemplateConfig } from './types.ts'
import type { Channel } from '../types.ts'
import { getPlatformInfo } from './platform-info.ts'
import { generateChannelLink } from './channel-link-generator.ts'
import { getChannelIcon, getChannelColor, getChannelUrl } from './channel-utils.ts'

export function generateMinimalChannelsHtml(channels: Channel[]): string {
  return channels.map(channel => {
    if (channel.childChannels && channel.childChannels.length > 0) {
      // Generate group button with dropdown for minimal template
      const platform = getPlatformInfo(channel.type);
      const dropdownId = `dropdown-${channel.id}`;
      const childCount = channel.childChannels.length;
      
      const dropdownItems = [channel, ...channel.childChannels].map((item, index) => {
        const href = generateChannelLink(item);
        const label = item.label;
        
        return `
          <a href="${href}" target="_blank" class="widget-dropdown-item" onclick="window.openChannel && window.openChannel('${href}')">
            <i class="${platform.icon}"></i>
            <div class="item-info">
              <div class="item-label">${label}${index === 0 ? ' (Primary)' : ''}</div>
              <div class="item-value">${item.value}</div>
            </div>
          </a>
        `;
      }).join('');
      
      return `
        <div class="widget-channel-group">
          <div class="widget-channel-btn widget-dropdown-btn" data-dropdown="${dropdownId}" data-type="${channel.type}">
            <i class="${platform.icon}"></i>
            <span class="child-indicator">+${childCount}</span>
          </div>
          <div class="widget-dropdown" id="${dropdownId}">
            ${dropdownItems}
          </div>
        </div>
      `;
    } else {
      // Regular individual channel for minimal template
      const platform = getPlatformInfo(channel.type);
      const href = generateChannelLink(channel);
      
      return `
        <a href="${href}" target="_blank" class="widget-channel-btn" data-type="${channel.type}" onclick="window.openChannel && window.openChannel('${href}')">
          <i class="${platform.icon}"></i>
        </a>
      `;
    }
  }).reverse().join(''); // Reverse to show channels from bottom to top
}

export function generateDefaultChannelsHtml(channels: Channel[]): string {
  return channels.map(channel => {
    if (channel.isGroup && channel.groupItems) {
      // Generate group for default template
      const iconSvg = getChannelIcon(channel.type, channel.customIcon, false)
      const channelColor = getChannelColor(channel.type)
      
      const groupItemsHtml = channel.groupItems.map(item => {
        const itemUrl = getChannelUrl(item)
        const itemIcon = getChannelIcon(item.type, item.customIcon, false)
        return `
          <a href="${itemUrl}" target="_blank" class="lovable-group-item" onclick="window.openChannel && window.openChannel('${itemUrl}')">
            <div class="lovable-group-item-icon" style="background: ${getChannelColor(item.type)}; color: white;">${itemIcon}</div>
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
    } else if (channel.childChannels && channel.childChannels.length > 0) {
      // Handle child channels for default template
      const iconSvg = getChannelIcon(channel.type, channel.customIcon, false)
      const channelColor = getChannelColor(channel.type)
      const dropdownId = `dropdown-${channel.id}`
      
      // Include parent channel as first item in dropdown
      const parentUrl = getChannelUrl(channel)
      const childItemsHtml = [
        // Parent channel as first item
        `<a href="${parentUrl}" target="_blank" class="lovable-group-item" onclick="window.openChannel && window.openChannel('${parentUrl}')">
          <div class="lovable-group-item-icon" style="background: ${channelColor}; color: white;">${iconSvg}</div>
          <div class="lovable-group-item-info">
            <div class="lovable-group-item-label">${channel.label} (Primary)</div>
            <div class="lovable-group-item-value">${channel.value}</div>
          </div>
        </a>`,
        // Child channels
        ...channel.childChannels.map(item => {
          const itemUrl = getChannelUrl(item)
          const itemIcon = getChannelIcon(item.type, item.customIcon, false)
          return `
            <a href="${itemUrl}" target="_blank" class="lovable-group-item" onclick="window.openChannel && window.openChannel('${itemUrl}')">
              <div class="lovable-group-item-icon" style="background: ${getChannelColor(item.type)}; color: white;">${itemIcon}</div>
              <div class="lovable-group-item-info">
                <div class="lovable-group-item-label">${item.label}</div>
                <div class="lovable-group-item-value">${item.value}</div>
              </div>
            </a>
          `
        })
      ].join('')
      
      return `
        <div class="lovable-channel-group">
          <div class="lovable-channel-button lovable-group-trigger" onclick="toggleDropdown('${dropdownId}')">
            <div class="lovable-channel-icon" style="background: ${channelColor}; color: white;">${iconSvg}</div>
            <div class="lovable-channel-info">
              <div class="lovable-channel-label">${channel.label}</div>
              <div class="lovable-channel-value">${channel.childChannels.length + 1} seçim</div>
            </div>
            <div class="lovable-channel-arrow">→</div>
            <span class="lovable-group-count">${channel.childChannels.length + 1}</span>
          </div>
          <div class="dropdown" id="${dropdownId}">
            ${childItemsHtml}
          </div>
        </div>
      `
    } else {
      // Regular individual channel for default template
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