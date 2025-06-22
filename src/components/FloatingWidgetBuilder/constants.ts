
import { MessageCircle, Send, Instagram, Mail, Link, Video, Phone, MessageSquare, Music, Github, Linkedin, Youtube, Twitter, Facebook, Globe, MessageCircleMore, Bot } from 'lucide-react';

export const platformOptions = [
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25d366' },
  { value: 'telegram', label: 'Telegram', icon: Send, color: '#0088cc' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#e4405f' },
  { value: 'messenger', label: 'Messenger', icon: MessageSquare, color: '#0084ff' },
  { value: 'viber', label: 'Viber', icon: Phone, color: '#665cac' },
  { value: 'skype', label: 'Skype', icon: Video, color: '#00aff0' },
  { value: 'discord', label: 'Discord', icon: MessageCircleMore, color: '#5865f2' },
  { value: 'tiktok', label: 'TikTok', icon: Music, color: '#ff0050' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: '#ff0000' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877f2' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: '#1da1f2' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
  { value: 'github', label: 'GitHub', icon: Github, color: '#333333' },
  { value: 'website', label: 'Website', icon: Globe, color: '#6b7280' },
  { value: 'chatbot', label: 'Chatbot', icon: Bot, color: '#8b5cf6' },
  { value: 'email', label: 'Email', icon: Mail, color: '#ea4335' },
  { value: 'custom', label: 'Custom Link', icon: Link, color: '#6b7280' }
];
