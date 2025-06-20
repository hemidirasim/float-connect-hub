
export interface Channel {
  id: string;
  type: string;
  value: string;
  label: string;
}

export interface Platform {
  value: string;
  label: string;
  icon: any;
  color: string;
}

export interface FormData {
  video: File | null;
  buttonColor: string;
  position: string;
  tooltip: string;
  useVideoPreview: boolean;
}

export interface Widget {
  id: string;
  name: string;
  website_url: string;
  button_color: string;
  position: string;
  tooltip: string;
  video_enabled: boolean;
  button_style: string;
  custom_icon_url: string;
  show_on_mobile: boolean;
  show_on_desktop: boolean;
  channels: Channel[];
  updated_at: string;
}
