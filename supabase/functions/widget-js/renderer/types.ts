
export interface TemplateConfig {
  channels: any[];
  buttonColor: string;
  position: string;
  tooltip: string;
  tooltipDisplay: string;
  tooltipPosition: string;
  greetingMessage: string;
  customIconUrl: string | null;
  videoEnabled: boolean;
  videoUrl: string | null;
  videoHeight: number;
  videoAlignment: string;
  videoObjectFit: string;
  useVideoPreview: boolean;
  buttonSize: number;
  previewVideoHeight: number;
  templateId: string;
  widgetWidth: number;
  widgetHeight: number;
}

export interface WidgetTemplate {
  name: string;
  description: string;
  htmlTemplate: string;
  cssStyles: string;
  jsTemplate: string;
}
