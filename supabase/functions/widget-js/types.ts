
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
}

export interface WidgetConfig {
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  customIconUrl?: string;
  videoEnabled: boolean;
  videoUrl?: string;
  videoHeight: number;
  videoAlignment: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
  templateId?: string; // Add template ID support
}
