
export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  supportsVideo?: boolean; // Optional parameter to control video support
}
