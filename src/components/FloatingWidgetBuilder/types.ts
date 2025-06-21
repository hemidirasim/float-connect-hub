
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
}

export interface FormData {
  video: File | null;
  buttonColor: string;
  position: 'left' | 'right';
  tooltip: string;
  tooltipDisplay: 'hover' | 'always' | 'never';
  useVideoPreview: boolean;
  videoHeight?: number;
  videoAlignment?: 'top' | 'center' | 'bottom';
  customIcon?: string;
  customIconUrl?: string;
}
