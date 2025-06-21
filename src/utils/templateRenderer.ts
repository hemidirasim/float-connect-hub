
import { Channel, FormData } from "@/components/FloatingWidgetBuilder/types";
import { WidgetTemplate, TemplateConfig } from './renderer/types';
import { PlaceholderReplacer } from './renderer/placeholderReplacer';
import { WidgetJavaScript } from './renderer/widgetJavaScript';

export { WidgetTemplate, TemplateConfig };

export class TemplateRenderer {
  private template: WidgetTemplate;
  private config: TemplateConfig;
  private placeholderReplacer: PlaceholderReplacer;
  private widgetJavaScript: WidgetJavaScript;

  constructor(template: WidgetTemplate, config: TemplateConfig) {
    this.template = template;
    this.config = config;
    this.placeholderReplacer = new PlaceholderReplacer(config);
    this.widgetJavaScript = new WidgetJavaScript(config);
  }

  public renderHTML(): string {
    return this.placeholderReplacer.replacePlaceholders(this.template.html);
  }

  public renderCSS(): string {
    return this.placeholderReplacer.replacePlaceholders(this.template.css);
  }

  public renderJS(): string {
    // Always use the template's JS if available
    if (this.template.js && this.template.js.trim()) {
      console.log('Using template JavaScript');
      return this.placeholderReplacer.replacePlaceholders(this.template.js);
    }
    
    console.log('Using fallback JavaScript');
    return this.widgetJavaScript.getWidgetJavaScript();
  }

  public renderComplete(): string {
    const html = this.renderHTML();
    const css = this.renderCSS();
    const js = this.renderJS();

    console.log('Rendering complete widget with JS:', !!js);

    return `
      <style>${css}</style>
      ${html}
      <script>${js}</script>
    `;
  }
}

export const createWidgetFromTemplate = (template: WidgetTemplate, config: TemplateConfig): string => {
  const renderer = new TemplateRenderer(template, config);
  return renderer.renderComplete();
};
