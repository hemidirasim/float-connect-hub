
import type { WidgetConfig } from './types.ts'
import { createWidgetConfig } from './template-config.ts'
import { getTemplateById } from './template-registry.ts'
import { WidgetTemplateRenderer, type TemplateConfig } from './template-generator.ts'

export function generateWidgetScript(widget: any): string {
  console.log('Widget data received:', {
    name: widget.name,
    template_id: widget.template_id,
    channels: widget.channels?.length || 0
  })
  
  const config = createWidgetConfig(widget)
  
  // Get template by ID - prioritize template_id from widget
  let templateId = 'default'
  
  if (widget.template_id && typeof widget.template_id === 'string') {
    templateId = widget.template_id
    console.log('Using template_id from widget:', templateId)
  } else if (config.templateId && typeof config.templateId === 'string') {
    templateId = config.templateId
    console.log('Using templateId from config:', templateId)
  }
  
  console.log('Final template ID selected:', templateId)
  
  const template = getTemplateById(templateId)
  console.log('Template loaded:', template.name, 'ID:', template.id)

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
  const script = renderer.generateWidgetScript()
  
  console.log('Widget script generated with template:', templateId, 'Length:', script.length)
  
  return script
}

// Simplified version that doesn't need database access
export async function generateWidgetScriptWithTemplate(widget: any, supabaseClient?: any): string {
  // No longer needs database access - templates are file-based
  return generateWidgetScript(widget)
}
