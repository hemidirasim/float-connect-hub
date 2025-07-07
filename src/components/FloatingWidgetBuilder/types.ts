
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
  customIcon?: string;
  isGroup?: boolean;
  groupItems?: Channel[];
  displayMode?: 'individual' | 'grouped';
  childChannels?: Channel[];
  parentId?: string;
}

export interface CustomField {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
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
}
