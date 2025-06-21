
import type { WidgetConfig } from './types.ts'
import { createWidgetConfig } from './template-config.ts'
import { getTemplateById } from './template-registry.ts'
import { WidgetTemplateRenderer, type TemplateConfig } from './template-generator.ts'

export function generateWidgetScript(widget: any): string {
  console.log('Widget data received for script generation:', {
    name: widget.name,
    template_id: widget.template_id,
    channels: widget.channels?.length || 0,
    raw_widget_data: JSON.stringify(widget, null, 2)
  })
  
  const config = createWidgetConfig(widget)
  
  // Get template ID directly from widget data - this is the most reliable source
  let templateId = 'default'
  
  // First check the database field template_id
  if (widget.template_id && typeof widget.template_id === 'string' && widget.template_id.trim() !== '') {
    templateId = widget.template_id.trim()
    console.log('Using template_id from widget database:', templateId)
  } 
  // Fallback to config templateId
  else if (config.templateId && typeof config.templateId === 'string' && config.templateId.trim() !== '') {
    templateId = config.templateId.trim()
    console.log('Using templateId from config:', templateId)
  }
  // Final fallback
  else {
    console.log('No valid template ID found, using default template')
    templateId = 'default'
  }
  
  console.log('Final template ID selected for generation:', templateId)
  
  const template = getTemplateById(templateId)
  console.log('Template loaded successfully:', {
    id: template.id,
    name: template.name,
    description: template.description
  })

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

  console.log('Template config created:', {
    templateId: templateId,
    channels: templateConfig.channels.length,
    buttonColor: templateConfig.buttonColor,
    position: templateConfig.position
  })

  const renderer = new WidgetTemplateRenderer(template, templateConfig)
  const script = renderer.generateWidgetScript()
  
  console.log('Widget script generated successfully:', {
    templateUsed: templateId,
    templateName: template.name,
    scriptLength: script.length,
    hasChannels: templateConfig.channels.length > 0
  })
  
  return script
}

// Simplified version that doesn't need database access
export async function generateWidgetScriptWithTemplate(widget: any, supabaseClient?: any): string {
  // No longer needs database access - templates are file-based
  return generateWidgetScript(widget)
}
