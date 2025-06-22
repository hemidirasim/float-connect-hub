
import { getPlatformConfig } from './platform-config.ts';

export function generateChannelUrl(channel: any) {
  switch (channel.type) {
    case 'whatsapp':
      return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
    case 'telegram':
      return channel.value.startsWith('@') ? 'https://t.me/' + channel.value.slice(1) : 'https://t.me/' + channel.value;
    case 'email':
      return 'mailto:' + channel.value;
    case 'phone':
      return 'tel:' + channel.value;
    default:
      return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
  }
}

export function generateChannelsHtml(channels: any[]) {
  if (!channels || channels.length === 0) {
    return '<div class="hiclient-empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><p>Heç bir əlaqə mövcud deyil</p></div>';
  }

  // Filter main channels (without parentId)
  const mainChannels = channels.filter(ch => !ch.parentId);
  
  return mainChannels.map(channel => {
    const platform = getPlatformConfig(channel.type);
    const hasChildren = channel.childChannels && channel.childChannels.length > 0;
    
    if (hasChildren) {
      // Generate group with children
      const childrenHtml = [channel, ...channel.childChannels].map(childChannel => {
        const childPlatform = getPlatformConfig(childChannel.type);
        const childUrl = generateChannelUrl(childChannel);
        return '<a href="' + childUrl + '" target="_blank" class="hiclient-group-item" onclick="window.openChannel && window.openChannel(\'' + childUrl + '\')"><div class="hiclient-group-item-icon" style="background: ' + childPlatform.color + ';">' + childPlatform.icon + '</div><div class="hiclient-group-item-info"><div class="hiclient-group-item-label">' + childChannel.label + '</div><div class="hiclient-group-item-value">' + childChannel.value + '</div></div></a>';
      }).join('');
      
      return '<div class="hiclient-channel-group"><div class="hiclient-channel-item hiclient-group-trigger" onclick="toggleGroup(this)"><div class="hiclient-channel-icon" style="background: ' + platform.color + ';">' + platform.icon + '</div><div class="hiclient-channel-info"><div class="hiclient-channel-label">' + channel.label + '</div><div class="hiclient-channel-value">' + (channel.childChannels.length + 1) + ' seçim</div></div></div><div class="hiclient-group-dropdown">' + childrenHtml + '</div></div>';
    } else {
      // Generate individual channel
      const channelUrl = generateChannelUrl(channel);
      return '<a href="' + channelUrl + '" target="_blank" class="hiclient-channel-item" onclick="window.openChannel && window.openChannel(\'' + channelUrl + '\')"><div class="hiclient-channel-icon" style="background: ' + platform.color + ';">' + platform.icon + '</div><div class="hiclient-channel-info"><div class="hiclient-channel-label">' + channel.label + '</div><div class="hiclient-channel-value">' + channel.value + '</div></div><svg class="hiclient-external-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></a>';
    }
  }).join('');
}

export function toggleGroup(trigger: HTMLElement) {
  const group = trigger.closest('.hiclient-channel-group');
  if (group) {
    group.classList.toggle('expanded');
  }
}
