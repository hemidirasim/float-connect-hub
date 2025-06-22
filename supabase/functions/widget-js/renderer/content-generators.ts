import type { TemplateConfig } from './types.ts'
import type { Channel } from '../types.ts'
import { getChannelIcon, getChannelColor, getChannelUrl } from './channel-utils.ts'

// Platform information mapping
const platformInfo = {
  whatsapp: { icon: 'fab fa-whatsapp', color: '#25d366' },
  telegram: { icon: 'fab fa-telegram-plane', color: '#0088cc' },
  instagram: { icon: 'fab fa-instagram', color: '#e4405f' },
  messenger: { icon: 'fab fa-facebook-messenger', color: '#006aff' },
  viber: { icon: 'fab fa-viber', color: '#665cac' },
  skype: { icon: 'fab fa-skype', color: '#00aff0' },
  discord: { icon: 'fab fa-discord', color: '#7289da' },
  tiktok: { icon: 'fab fa-tiktok', color: '#000000' },
  youtube: { icon: 'fab fa-youtube', color: '#ff0000' },
  facebook: { icon: 'fab fa-facebook', color: '#1877f2' },
  twitter: { icon: 'fab fa-twitter', color: '#1da1f2' },
  linkedin: { icon: 'fab fa-linkedin', color: '#0077b5' },
  github: { icon: 'fab fa-github', color: '#333333' },
  website: { icon: 'fas fa-globe', color: '#6b7280' },
  chatbot: { icon: 'fas fa-robot', color: '#3b82f6' },
  email: { icon: 'fas fa-envelope', color: '#ea4335' },
  phone: { icon: 'fas fa-phone', color: '#34d399' },
  custom: { icon: 'fas fa-link', color: '#6b7280' }
};

function getPlatformInfo(type: string) {
  return platformInfo[type as keyof typeof platformInfo] || platformInfo.custom;
}

function generateChannelLink(channel: Channel): string {
  switch (channel.type) {
    case 'whatsapp':
      return `https://wa.me/${channel.value.replace(/[^0-9]/g, '')}`;
    case 'telegram':
      return channel.value.startsWith('@') ? `https://t.me/${channel.value.slice(1)}` : `https://t.me/${channel.value}`;
    case 'email':
      return `mailto:${channel.value}`;
    case 'phone':
      return `tel:${channel.value}`;
    default:
      return channel.value.startsWith('http') ? channel.value : `https://${channel.value}`;
  }
}

export function generateChannelsHtml(config: TemplateConfig, templateId: string): string {
  if (templateId === 'minimal') {
    // For minimal template, process channels with child support and proper bottom-to-top arrangement
    return config.channels.map(channel => {
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
                <div class="item-label">${label}</div>
                <div class="item-value">${item.value}</div>
              </div>
            </a>
          `;
        }).join('');
        
        return `
          <div class="widget-channel-group">
            <a href="${generateChannelLink(channel)}" target="_blank" class="widget-channel-btn widget-dropdown-btn" data-dropdown="${dropdownId}" data-type="${channel.type}" onclick="window.openChannel && window.openChannel('${generateChannelLink(channel)}')">
              <i class="${platform.icon}"></i>
              <span class="child-indicator">+${childCount}</span>
            </a>
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
    }).reverse().join(''); // Reverse to show channels from bottom to top like in the image
  }
  
  // Default template logic
  return config.channels.map(channel => {
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
      
      const childItemsHtml = [channel, ...channel.childChannels].map(item => {
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
              <div class="lovable-channel-value">${channel.childChannels.length + 1} seçim</div>
            </div>
            <div class="lovable-channel-arrow">→</div>
            <span class="lovable-group-count">${channel.childChannels.length + 1}</span>
          </div>
          <div class="lovable-group-dropdown">
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
      <a href="${href}" target="_blank" class="widget-dropdown-item" onclick="window.openChannel && window.openChannel('${href}')">
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
    <a href="${href}" target="_blank" class="widget-channel-btn" data-channel-type="${channel.type}" onclick="window.openChannel && window.openChannel('${href}')">
      <i class="${platform.icon}"></i>
      <span>${channel.label}</span>
    </a>
  `;
}
