
export interface WidgetConfig {
  channels: any[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  customIconUrl: string;
  videoEnabled: boolean;
  videoUrl: string;
  videoHeight: number;
  videoAlignment: string;
}

export interface Widget {
  id: string;
  name: string;
  channels: any[];
  button_color: string;
  position: string;
  tooltip: string;
  tooltip_display: string;
  custom_icon_url: string;
  video_enabled: boolean;
  video_url: string;
  video_height: number;
  video_alignment: string;
}

export interface ViewResult {
  success: boolean;
  error?: string;
}
