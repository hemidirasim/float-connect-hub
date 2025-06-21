
import type { WidgetConfig } from './types.ts'
import { createWidgetConfig } from './template-config.ts'
import { getTemplateById } from './template-registry.ts'
import { WidgetTemplateRenderer, type TemplateConfig } from './template-generator.ts'

export function generateWidgetScript(widget: any): string {
  const config = createWidgetConfig(widget)
  
  // Get template by ID - use the actual template_id from widget, fallback to 'default'
  // For now, we'll determine template from form data or use default
  let templateId = 'default'
  
  // Try different sources for template ID
  if (widget.template_id) {
    templateId = widget.template_id
  } else if (widget.templateId) {
    templateId = widget.templateId
  } else if (config.templateId) {
    templateId = config.templateId
  }
  
  console.log('Using template ID:', templateId, 'for widget:', widget.name)
  
  const template = getTemplateById(templateId)
  console.log('Selected template:', template.name)

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

// Simplified version that doesn't need database access
export async function generateWidgetScriptWithTemplate(widget: any, supabaseClient?: any): string {
  // No longer needs database access - templates are file-based
  return generateWidgetScript(widget)
}
