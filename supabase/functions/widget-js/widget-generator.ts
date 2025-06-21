
import type { WidgetConfig } from './types.ts'
import { createWidgetConfig } from './template-config.ts'
import { getTemplateById } from './template-registry.ts'
import { WidgetTemplateRenderer, type TemplateConfig } from './template-generator.ts'

export function generateWidgetScript(widget: any): string {
  const config = createWidgetConfig(widget)
  
  // Get template by ID (falls back to default if not found)
  const templateId = widget.template_id || 'default'
  const template = getTemplateById(templateId)

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

// Simplified version that doesn't need database access
export async function generateWidgetScriptWithTemplate(widget: any, supabaseClient?: any): string {
  // No longer needs database access - templates are file-based
  return generateWidgetScript(widget)
}
