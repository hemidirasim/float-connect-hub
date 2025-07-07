
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
  color?: string;
  icon?: string;
}

export interface WidgetConfig {
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  tooltipPosition: string;
  greetingMessage: string;
  customIconUrl?: string;
  videoEnabled: boolean;
  videoUrl?: string;
  videoHeight: number;
  videoAlignment: string;
  videoObjectFit: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
  templateId: string;
  // Live chat settings
  liveChatEnabled: boolean;
  liveChatGreeting: string;
  liveChatColor: string;
  liveChatPosition: string;
  liveChatAutoOpen: boolean;
  liveChatOfflineMessage: string;
}
