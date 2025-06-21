
import type { WidgetConfig } from './types.ts'
import { createWidgetConfig } from './template-config.ts'
import { getDefaultTemplate } from './default-template.ts'
import { WidgetTemplateRenderer, type TemplateConfig } from './template-generator.ts'

export function generateWidgetScript(widget: any): string {
  const config = createWidgetConfig(widget)
  
  // Get the template - either the selected one or default
  let template;
  if (widget.template_id) {
    // If widget has a specific template selected, we should fetch it from database
    // For now, we'll use the default template since we don't have database access here
    // TODO: Implement template fetching from database in edge function
    template = getDefaultTemplate();
  } else {
    template = getDefaultTemplate();
  }

  console.log('Generating script with template:', template.name, 'for widget:', widget.name)

  const templateConfig: TemplateConfig = {
    channels: config.channels,
    buttonColor: config.buttonColor,
    position: config.position,
    tooltip: config.tooltip,
    tooltipDisplay: config.tooltipDisplay,
    customIconUrl: config.customIconUrl,
    videoEnabled: config.videoEnabled,
    videoUrl: config.videoUrl,
    videoHeight: config.videoHeight,
    videoAlignment: config.videoAlignment,
    useVideoPreview: config.useVideoPreview,
    buttonSize: config.buttonSize,
    previewVideoHeight: config.previewVideoHeight
  }

  const renderer = new WidgetTemplateRenderer(template, templateConfig)
  return renderer.generateWidgetScript()
}

// New function to fetch template from database
async function fetchTemplate(templateId: string, supabaseClient: any) {
  try {
    const { data, error } = await supabaseClient
      .from('widget_templates')
      .select('*')
      .eq('id', templateId)
      .eq('is_active', true)
      .single();
      
    if (error) {
      console.error('Error fetching template:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchTemplate:', error);
    return null;
  }
}

export async function generateWidgetScriptWithTemplate(widget: any, supabaseClient: any): string {
  const config = createWidgetConfig(widget)
  
  // Get the template - either the selected one or default
  let template = getDefaultTemplate();
  
  if (widget.template_id) {
    console.log('Fetching template with ID:', widget.template_id);
    const fetchedTemplate = await fetchTemplate(widget.template_id, supabaseClient);
    if (fetchedTemplate) {
      template = fetchedTemplate;
      console.log('Using fetched template:', template.name);
    } else {
      console.log('Failed to fetch template, using default');
    }
  }

  console.log('Generating script with template:', template.name, 'for widget:', widget.name)

  const templateConfig: TemplateConfig = {
    channels: config.channels,
    buttonColor: config.buttonColor,
    position: config.position,
    tooltip: config.tooltip,
    tooltipDisplay: config.tooltipDisplay,
    customIconUrl: config.customIconUrl,
    videoEnabled: config.videoEnabled,
    videoUrl: config.videoUrl,
    videoHeight: config.videoHeight,
    videoAlignment: config.videoAlignment,
    useVideoPreview: config.useVideoPreview,
    buttonSize: config.buttonSize,
    previewVideoHeight: config.previewVideoHeight
  }

  const renderer = new WidgetTemplateRenderer(template, templateConfig)
  return renderer.generateWidgetScript()
}
