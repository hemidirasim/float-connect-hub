
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
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
