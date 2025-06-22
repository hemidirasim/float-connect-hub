
import type { Channel } from '../types.ts'

export function generateChannelLink(channel: Channel): string {
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
