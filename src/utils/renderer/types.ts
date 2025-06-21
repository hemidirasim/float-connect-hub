
import { Channel } from "@/components/FloatingWidgetBuilder/types";

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

export interface TemplateConfig {
  channels: Channel[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  customIconUrl?: string;
  videoEnabled: boolean;
  videoUrl?: string;
  videoHeight: number;
  videoAlignment: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
}
