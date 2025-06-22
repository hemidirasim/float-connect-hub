
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
  customIcon?: string;
  // New grouping properties
  isGroup?: boolean;
  groupItems?: Channel[];
  displayMode?: 'individual' | 'grouped';
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

export interface TemplateConfig {
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  tooltipPosition?: string;
  greetingMessage: string;
  customIconUrl?: string;
  videoEnabled: boolean;
  videoUrl?: string;
  videoHeight: number;
  videoAlignment: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
}

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
}
