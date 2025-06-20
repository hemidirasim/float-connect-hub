
import { MessageCircle, Send, Instagram, Mail, Link, Video, Phone, MessageSquare, Music } from 'lucide-react';

export const platformOptions = [
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25d366' },
  { value: 'telegram', label: 'Telegram', icon: Send, color: '#0088cc' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#e4405f' },
  { value: 'messenger', label: 'Messenger', icon: MessageSquare, color: '#0084ff' },
  { value: 'viber', label: 'Viber', icon: Phone, color: '#665cac' },
  { value: 'skype', label: 'Skype', icon: Video, color: '#00aff0' },
  { value: 'discord', label: 'Discord', icon: MessageCircle, color: '#5865f2' },
  { value: 'tiktok', label: 'TikTok', icon: Music, color: '#ff0050' },
  { value: 'email', label: 'Email', icon: Mail, color: '#ea4335' },
  { value: 'custom', label: 'Custom Link', icon: Link, color: '#6b7280' }
];
