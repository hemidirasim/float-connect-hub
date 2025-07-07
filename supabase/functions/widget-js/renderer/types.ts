
import type { Channel } from '../types.ts'

export interface TemplateConfig {
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
  videoObjectFit?: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
  widgetWidth?: number;
  widgetHeight?: number;
}
