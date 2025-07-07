
import type { Channel } from '../types.ts'
import { getChannelUrl, getChannelIcon, getChannelColor } from '../templates/default/utility-functions.ts'

export function generateChannelElements(channels: Channel[]): string {
  if (!channels || channels.length === 0) {
    return ''
  }

  // Process channels to handle groups and children
  const processedChannels = channels.map(channel => {
    if (channel.childChannels && channel.childChannels.length > 0) {
      // If channel has children, create a grouped display
      return {
        ...channel,
        isGroup: true,
        groupItems: channel.childChannels
      }
    }
    return channel
  })

  return processedChannels.map(channel => {
    if (channel.isGroup && channel.groupItems) {
      // Handle grouped channels
      const groupIcon = channel.customIcon ? 
        `<img src="${channel.customIcon}" alt="${channel.label}" style="width: 24px; height: 24px;">` : 
        getChannelIcon(channel.type)
      
      const groupItems = channel.groupItems.map(item => {
        const itemUrl = getChannelUrl(item.type, item.value)
        const itemIcon = item.customIcon ? 
          `<img src="${item.customIcon}" alt="${item.label}" style="width: 20px; height: 20px;">` : 
          getChannelIcon(item.type)
        
        return `
          <div class="hiclient-group-item" onclick="openChannel('${itemUrl}')">
            <div class="hiclient-group-item-icon">${itemIcon}</div>
            <span class="hiclient-group-item-label">${item.label}</span>
          </div>
        `
      }).join('')

      return `
        <div class="hiclient-channel-group" data-channel-id="${channel.id}">
          <div class="hiclient-channel-button" onclick="toggleChannelGroup('${channel.id}')">
            <div class="hiclient-channel-icon">${groupIcon}</div>
            <span class="hiclient-channel-label">${channel.label}</span>
            <div class="hiclient-group-arrow">▼</div>
          </div>
          <div class="hiclient-group-items" id="group-${channel.id}" style="display: none;">
            ${groupItems}
          </div>
        </div>
      `
    } else {
      // Handle individual channels
      const url = getChannelUrl(channel.type, channel.value)
      const icon = channel.customIcon ? 
        `<img src="${channel.customIcon}" alt="${channel.label}" style="width: 24px; height: 24px;">` : 
        getChannelIcon(channel.type)
      
      return `
        <div class="hiclient-channel-item" onclick="openChannel('${url}')" style="border-left: 4px solid ${getChannelColor(channel.type)};">
          <div class="hiclient-channel-icon">${icon}</div>
          <div class="hiclient-channel-content">
            <div class="hiclient-channel-label">${channel.label}</div>
            <div class="hiclient-channel-value">${channel.value}</div>
          </div>
        </div>
      `
    }
  }).join('')
}

export function generateChannelsForPopup(channels: Channel[]): string {
  if (!channels || channels.length === 0) {
    return '<div class="hiclient-no-channels">No contact channels available</div>'
  }

  // Process channels to handle children properly
  const processedChannels = channels.map(channel => {
    if (channel.childChannels && channel.childChannels.length > 0) {
      return {
        ...channel,
        isGroup: true,
        groupItems: channel.childChannels
      }
    }
    return channel
  })

  return processedChannels.map(channel => {
    const icon = channel.customIcon ? 
      `<img src="${channel.customIcon}" alt="${channel.label}" style="width: 28px; height: 28px;">` : 
      getChannelIcon(channel.type)
    
    if (channel.isGroup && channel.groupItems) {
      return `
        <div class="hiclient-popup-channel-group">
          <div class="hiclient-popup-channel-header">${channel.label}</div>
          ${channel.groupItems.map(item => {
            const itemUrl = getChannelUrl(item.type, item.value)
            const itemIcon = item.customIcon ? 
              `<img src="${item.customIcon}" alt="${item.label}" style="width: 24px; height: 24px;">` : 
              getChannelIcon(item.type)
            
            return `
              <div class="hiclient-popup-channel" onclick="openChannel('${itemUrl}')" style="background-color: ${getChannelColor(item.type)}15; border-left: 3px solid ${getChannelColor(item.type)};">
                <div class="hiclient-popup-channel-icon">${itemIcon}</div>
                <span class="hiclient-popup-channel-label">${item.label}</span>
              </div>
            `
          }).join('')}
        </div>
      `
    } else {
      const url = getChannelUrl(channel.type, channel.value)
      return `
        <div class="hiclient-popup-channel" onclick="openChannel('${url}')" style="background-color: ${getChannelColor(channel.type)}15; border-left: 3px solid ${getChannelColor(channel.type)};">
          <div class="hiclient-popup-channel-icon">${icon}</div>
          <span class="hiclient-popup-channel-label">${channel.label}</span>
        </div>
      `
    }
  }).join('')
}

export function generateMinimalChannelsHtml(channels: Channel[]): string {
  return channels.map(channel => {
    if (channel.childChannels && channel.childChannels.length > 0) {
      // Generate group button with dropdown for minimal template
      const dropdownId = `dropdown-${channel.id}`;
      const childCount = channel.childChannels.length;
      const channelIcon = getChannelIcon(channel.type);
      
      const dropdownItems = [channel, ...channel.childChannels].map((item, index) => {
        const href = getChannelUrl(item.type, item.value);
        const label = item.label;
        
        return `
          <a href="${href}" target="_blank" class="widget-dropdown-item" onclick="window.openChannel && window.openChannel('${href}')">
            <i class="${channelIcon}"></i>
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
            <i class="${channelIcon}"></i>
            <span class="child-indicator">+${childCount}</span>
          </div>
          <div class="widget-dropdown" id="${dropdownId}">
            ${dropdownItems}
          </div>
        </div>
      `;
    } else {
      // Regular individual channel for minimal template
      const channelIcon = getChannelIcon(channel.type);
      const href = getChannelUrl(channel.type, channel.value);
      
      return `
        <a href="${href}" target="_blank" class="widget-channel-btn" data-type="${channel.type}" onclick="window.openChannel && window.openChannel('${href}')">
          <i class="${channelIcon}"></i>
        </a>
      `;
    }
  }).reverse().join(''); // Reverse to show channels from bottom to top
}

export function generateDefaultChannelsHtml(channels: Channel[]): string {
  return channels.map(channel => {
    if (channel.isGroup && channel.groupItems) {
      // Generate group for default template
      const iconSvg = getChannelIcon(channel.type)
      const channelColor = getChannelColor(channel.type)
      
      const groupItemsHtml = channel.groupItems.map(item => {
        const itemUrl = getChannelUrl(item.type, item.value)
        const itemIcon = getChannelIcon(item.type)
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
      const iconSvg = getChannelIcon(channel.type)
      const channelColor = getChannelColor(channel.type)
      const dropdownId = `dropdown-${channel.id}`
      
      // Include parent channel as first item in dropdown
      const parentUrl = getChannelUrl(channel.type, channel.value)
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
          const itemUrl = getChannelUrl(item.type, item.value)
          const itemIcon = getChannelIcon(item.type)
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
      const iconSvg = getChannelIcon(channel.type)
      const channelUrl = getChannelUrl(channel.type, channel.value)
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
