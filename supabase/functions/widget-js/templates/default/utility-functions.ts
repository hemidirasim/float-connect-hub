
// Channel utility functions for default template
export function getChannelUrl(channel: any): string {
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

export function getChannelIcon(channel: any): string {
  const icons: Record<string, string> = {
    whatsapp: '📱',
    telegram: '✈️',
    instagram: '📷',
    messenger: '💬',
    viber: '📞',
    skype: '💻',
    discord: '🎮',
    tiktok: '🎵',
    youtube: '📺',
    facebook: '👥',
    twitter: '🐦',
    linkedin: '💼',
    github: '⚡',
    website: '🌐',
    chatbot: '🤖',
    email: '✉️',
    phone: '📞',
    custom: '🔗'
  };
  return icons[channel.type] || '🔗';
}

export function getChannelColor(type: string): string {
  const colors: Record<string, string> = {
    whatsapp: '#25d366',
    telegram: '#0088cc',
    instagram: '#e4405f',
    messenger: '#006aff',
    viber: '#665cac',
    skype: '#00aff0',
    discord: '#7289da',
    tiktok: '#000000',
    youtube: '#ff0000',
    facebook: '#1877f2',
    twitter: '#1da1f2',
    linkedin: '#0077b5',
    github: '#333333',
    website: '#6b7280',
    chatbot: '#3b82f6',
    email: '#ea4335',
    phone: '#34d399',
    custom: '#6b7280'
  };
  return colors[type] || '#6b7280';
}
