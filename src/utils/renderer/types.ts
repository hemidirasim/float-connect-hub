export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
}

export interface WidgetData {
  websiteUrl: string;
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  videoUrl?: string;
  useVideoPreview: boolean;
  videoHeight: number;
  videoAlignment: string;
  customIcon?: string;
  buttonSize: number;
  previewVideoHeight: number;
  templateId: string;
  greetingMessage: string;
}
