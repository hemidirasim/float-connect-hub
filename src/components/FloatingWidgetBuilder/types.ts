
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
}

export interface FormData {
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  video: File | null;
  videoUrl?: string; // Add videoUrl to track uploaded video URL
  useVideoPreview: boolean;
  videoHeight: number;
  videoAlignment: string;
  customIcon: string | null;
  customIconUrl: string;
}
