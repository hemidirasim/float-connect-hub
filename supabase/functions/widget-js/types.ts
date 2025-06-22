
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
  customIcon?: string; // For custom uploaded icons
}

export interface WidgetConfig {
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  tooltipPosition?: string;
  greetingMessage?: string;
  customIconUrl?: string;
  videoEnabled: boolean;
  videoUrl?: string;
  videoHeight: number;
  videoAlignment: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
  templateId?: string;
}
