
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

export interface FormData {
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  tooltipPosition: string;
  greetingMessage: string;
  video: File | null;
  videoUrl?: string;
  useVideoPreview: boolean;
  videoHeight: number;
  videoAlignment: string;
  videoObjectFit: string;
  customIcon: string;
  customIconUrl: string;
  buttonSize: number;
  previewVideoHeight: number;
  templateId: string;
  widgetWidth: number;
  widgetHeight: number;
}
