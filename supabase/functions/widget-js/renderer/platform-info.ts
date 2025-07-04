
export interface PlatformInfo {
  icon: string;
  color: string;
  name: string;
}

export const platformConfig: Record<string, PlatformInfo> = {
  whatsapp: { icon: 'fab fa-whatsapp', color: '#25d366', name: 'WhatsApp' },
  telegram: { icon: 'fab fa-telegram-plane', color: '#0088cc', name: 'Telegram' },
  instagram: { icon: 'fab fa-instagram', color: '#e4405f', name: 'Instagram' },
  messenger: { icon: 'fab fa-facebook-messenger', color: '#006aff', name: 'Messenger' },
  viber: { icon: 'fab fa-viber', color: '#665cac', name: 'Viber' },
  discord: { icon: 'fab fa-discord', color: '#7289da', name: 'Discord' },
  tiktok: { icon: 'fab fa-tiktok', color: '#000000', name: 'TikTok' },
  youtube: { icon: 'fab fa-youtube', color: '#ff0000', name: 'YouTube' },
  facebook: { icon: 'fab fa-facebook', color: '#1877f2', name: 'Facebook' },
  x: { icon: 'fab fa-x', color: '#1da1f2', name: 'x' },
  linkedin: { icon: 'fab fa-linkedin', color: '#0077b5', name: 'LinkedIn' },
  github: { icon: 'fab fa-github', color: '#333333', name: 'GitHub' },
  website: { icon: 'fas fa-globe', color: '#6b7280', name: 'Website' },
  email: { icon: 'fas fa-envelope', color: '#ea4335', name: 'Email' },
  phone: { icon: 'fas fa-phone', color: '#34d399', name: 'Phone' },
  custom: { icon: 'fas fa-link', color: '#6b7280', name: 'Custom' }
};

export function getPlatformInfo(type: string): PlatformInfo {
  return platformConfig[type] || platformConfig.custom;
}
