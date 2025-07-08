
export function extractWidgetId(url: URL): string {
  const pathParts = url.pathname.split('/').filter(part => part.length > 0)
  
  // Find widget-js in the path and get the next part
  const widgetJsIndex = pathParts.findIndex(part => part === 'widget-js')
  if (widgetJsIndex !== -1 && widgetJsIndex + 1 < pathParts.length) {
    return pathParts[widgetJsIndex + 1]
  }
  
  return ''
}

export function getChannelUrl(channel: any): string {
  switch (channel.type) {
    case 'whatsapp':
      return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
    case 'telegram':
      return 'https://t.me/' + channel.value.replace('@', '');
    case 'email':
      return 'mailto:' + channel.value;
    case 'phone':
      return 'tel:' + channel.value;
    case 'instagram':
      return channel.value.startsWith('http') ? channel.value : 'https://instagram.com/' + channel.value.replace('@', '');
    case 'facebook':
      return channel.value.startsWith('http') ? channel.value : 'https://facebook.com/' + channel.value;
    case 'twitter':
      return channel.value.startsWith('http') ? channel.value : 'https://x.com/' + channel.value.replace('@', '');
    case 'linkedin':
      return channel.value.startsWith('http') ? channel.value : 'https://linkedin.com/in/' + channel.value;
    case 'youtube':
      return channel.value.startsWith('http') ? channel.value : 'https://youtube.com/@' + channel.value;
    case 'github':
      return channel.value.startsWith('http') ? channel.value : 'https://github.com/' + channel.value;
    case 'tiktok':
      return channel.value.startsWith('http') ? channel.value : 'https://tiktok.com/@' + channel.value;
    case 'behance':
      return channel.value.startsWith('http') ? channel.value : 'https://behance.com/' + channel.value;
    case 'dribble':
      return channel.value.startsWith('http') ? channel.value : 'https://dribble.com/' + channel.value;
    case 'messenger':
      return channel.value.startsWith('http') ? channel.value : 'https://m.me/' + channel.value;
    case 'viber':
      return 'viber://chat?number=' + channel.value.replace(/[^0-9]/g, '');
    case 'discord':
      return channel.value;
    case 'website':
      return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
    case 'custom':
      return channel.value.startsWith('http') ? channel.value : 'https://' + channel.value;
    default:
      return channel.value;
  }
}

export function getChannelIcon(type: string, customIcon?: string): string {
  // If it's a custom link and has a custom icon, use it
  if (type === 'custom' && customIcon) {
    return `<img src="${customIcon}" style="width: 20px; height: 20px; object-fit: contain;" alt="Custom icon">`;
  }

  // Use Supabase Storage URLs for all platform icons
  const baseIconUrl = 'https://ttzioshkresaqmsodhfb.supabase.co/storage/v1/object/public/icons/social-media/';
  const icons = {
    whatsapp: `<img src="${baseIconUrl}007-social.png" style="width: 20px; height: 20px; object-fit: contain;" alt="WhatsApp">`,
    telegram: `<img src="${baseIconUrl}006-telegram.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Telegram">`,
    email: `<img src="${baseIconUrl}019-mail.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Email">`,
    phone: `<img src="${baseIconUrl}telephone.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Phone">`,
    instagram: `<img src="${baseIconUrl}002-instagram.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Instagram">`,
    facebook: `<img src="${baseIconUrl}003-facebook.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Facebook">`,
    twitter: `<img src="${baseIconUrl}twitter.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Twitter">`,
    linkedin: `<img src="${baseIconUrl}005-linkedin.png" style="width: 20px; height: 20px; object-fit: contain;" alt="LinkedIn">`,
    youtube: `<img src="${baseIconUrl}008-youtube.png" style="width: 20px; height: 20px; object-fit: contain;" alt="YouTube">`,
    github: `<img src="${baseIconUrl}012-github.png" style="width: 20px; height: 20px; object-fit: contain;" alt="GitHub">`,
    tiktok: `<img src="${baseIconUrl}004-tiktok.png" style="width: 20px; height: 20px; object-fit: contain;" alt="TikTok">`,
    behance: `<img src="${baseIconUrl}014-behance.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Behance">`,
    dribble: `<img src="${baseIconUrl}013-dribble.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Dribbble">`,
    messenger: `<img src="${baseIconUrl}018-messenger.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Messenger">`,
    viber: `<img src="${baseIconUrl}011-viber.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Viber">`,
    discord: `<img src="${baseIconUrl}017-discord.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Discord">`,
    figma: `<img src="${baseIconUrl}016-figma.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Figma">`,
    upwork: `<img src="${baseIconUrl}015-upwork.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Upwork">`,
    website: `<img src="${baseIconUrl}internet.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Website">`,
    // Default link icon for custom links without custom icons
    custom: `<img src="${baseIconUrl}link.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Link">`
  };
  
  return icons[type as keyof typeof icons] || `<img src="${baseIconUrl}link.png" style="width: 20px; height: 20px; object-fit: contain;" alt="Link">`;
}

export function getChannelColor(type: string): string {
  const colors = {
    whatsapp: '#25d366',
    telegram: '#0088cc',
    email: '#ea4335',
    phone: '#22c55e',
    instagram: '#e4405f',
    facebook: '#1877f2',
    x: '#1da1f2',
    linkedin: '#0077b5',
    youtube: '#ff0000',
    github: '#333333',
    tiktok: '#ff0050',
    behance: '#ff0050',
    dribble: '#ff0050',
    messenger: '#0084ff',
    viber: '#665cac',
    discord: '#5865f2',
    website: '#6b7280',
    custom: '#6b7280' // Gray color for custom links
  };
  
  return colors[type as keyof typeof colors] || '#6b7280';
}
