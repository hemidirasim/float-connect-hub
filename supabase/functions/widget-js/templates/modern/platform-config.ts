
export const platformConfig = {
  whatsapp: { icon: '💬', color: '#25d366', name: 'WhatsApp' },
  telegram: { icon: '✈️', color: '#0088cc', name: 'Telegram' },
  instagram: { icon: '📸', color: '#e4405f', name: 'Instagram' },
  messenger: { icon: '💬', color: '#006aff', name: 'Messenger' },
  viber: { icon: '📞', color: '#665cac', name: 'Viber' },
  skype: { icon: '📹', color: '#00aff0', name: 'Skype' },
  discord: { icon: '🎮', color: '#7289da', name: 'Discord' },
  tiktok: { icon: '🎵', color: '#000000', name: 'TikTok' },
  youtube: { icon: '📺', color: '#ff0000', name: 'YouTube' },
  facebook: { icon: '👥', color: '#1877f2', name: 'Facebook' },
  twitter: { icon: '🐦', color: '#1da1f2', name: 'Twitter' },
  linkedin: { icon: '💼', color: '#0077b5', name: 'LinkedIn' },
  github: { icon: '💻', color: '#333333', name: 'GitHub' },
  website: { icon: '🌐', color: '#6b7280', name: 'Website' },
  chatbot: { icon: '🤖', color: '#3b82f6', name: 'Chatbot' },
  email: { icon: '✉️', color: '#ea4335', name: 'Email' },
  phone: { icon: '📞', color: '#34d399', name: 'Telefon' },
  custom: { icon: '🔗', color: '#6b7280', name: 'Custom' }
};

export function getPlatformConfig(type: string) {
  return platformConfig[type as keyof typeof platformConfig] || platformConfig.custom;
}
