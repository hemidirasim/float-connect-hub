
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
  color?: string;
  icon?: string;
  customIcon?: string; // For custom uploaded icons
  // New grouping properties
  isGroup?: boolean;
  groupItems?: Channel[];
  displayMode?: 'individual' | 'grouped';
  // New child channels for same type grouping
  childChannels?: Channel[];
  parentId?: string; // Reference to parent channel
}

export interface WidgetConfig {
  name: string;
  template: string;
  greetingMessage: string;
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltipText: string;
  tooltipDisplay: string;
  tooltipPosition: string;
  customIcon: string;
  customIconUrl: string;
  buttonSize: number;
  videoEnabled?: boolean;
  videoUrl?: string;
  videoHeight?: number;
  videoAlignment?: string;
  videoObjectFit?: string;
  useVideoPreview?: boolean;
  previewVideoHeight?: number;
}

export interface FormData {
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  tooltipPosition: string;
  greetingMessage: string;
  video: File | null;
  videoUrl?: string;
  videoType: 'upload' | 'link'; // New field to distinguish between upload and link
  videoLink?: string; // For video links from platforms
  useVideoPreview: boolean;
  videoHeight: number;
  videoAlignment: string;
  videoObjectFit: string;
  customIcon: string;
  customIconUrl: string;
  buttonSize: number;
  previewVideoHeight: number;
  templateId: string;
}
