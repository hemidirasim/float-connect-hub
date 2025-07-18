
import { MessageCircle, Send, Instagram, Mail, Link, Video, Phone, MessageSquare, Music, Github, Linkedin, Youtube, Twitter, Facebook, Globe, MessageCircleMore, Bot, Palette, Camera, Briefcase, Code, Zap, Users } from 'lucide-react';

export const platformOptions = [
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25d366' },
  { value: 'telegram', label: 'Telegram', icon: Send, color: '#0088cc' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: '#e4405f' },
  { value: 'messenger', label: 'Messenger', icon: MessageSquare, color: '#0084ff' },
  { value: 'viber', label: 'Viber', icon: Phone, color: '#665cac' },
  { value: 'discord', label: 'Discord', icon: MessageCircleMore, color: '#5865f2' },
  { value: 'tiktok', label: 'TikTok', icon: Music, color: '#ff0050' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: '#ff0000' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877f2' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: '#1da1f2' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
  { value: 'github', label: 'GitHub', icon: Github, color: '#333333' },
  { value: 'behance', label: 'Behance', icon: Palette, color: '#1769ff' },
  { value: 'dribble', label: 'Dribble', icon: Camera, color: '#ea4c89' },
  { value: 'pinterest', label: 'Pinterest', icon: Camera, color: '#bd081c' },
  { value: 'figma', label: 'Figma', icon: Code, color: '#f24e1e' },
  { value: 'upwork', label: 'Upwork', icon: Briefcase, color: '#6fda44' },
  { value: 'fiverr', label: 'Fiverr', icon: Zap, color: '#1dbf73' },
  { value: 'freelancer', label: 'Freelancer', icon: Users, color: '#0e4194' },
  { value: 'website', label: 'Website', icon: Globe, color: '#6b7280' },
  { value: 'email', label: 'Email', icon: Mail, color: '#ea4335' },
  { value: 'phone', label: 'Phone', icon: Phone, color: '#22c55e' },
  { value: 'custom', label: 'Custom Link', icon: Link, color: '#6b7280' }
];

// Demo button styling for consistent design
export const demoButtonStyles = {
  base: "relative group overflow-hidden rounded-2xl px-8 py-4 font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl",
  gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600",
  glow: "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
  glassmorphism: "backdrop-blur-sm border border-white/20",
  shimmer: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
};

