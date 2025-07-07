
import type { WidgetConfig } from './types.ts'
import { createWidgetConfig } from './template-config.ts'
import { getTemplateById } from './template-registry.ts'
import { WidgetTemplateRenderer, type TemplateConfig } from './template-generator.ts'

export function generateWidgetScript(widget: any): string {
  console.log('Widget data received for script generation:', {
    name: widget.name,
    template_id: widget.template_id,
    greeting_message: widget.greeting_message,
    channels: widget.channels?.length || 0,
    video_enabled: widget.video_enabled,
    video_url: widget.video_url,
    preview_video_height: widget.preview_video_height,
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
    tooltipPosition: config.tooltipPosition,
    greetingMessage: config.greetingMessage,
    customIconUrl: config.customIconUrl,
    videoEnabled: config.videoEnabled,
    videoUrl: config.videoUrl,
    videoHeight: config.videoHeight,
    videoAlignment: config.videoAlignment,
    videoObjectFit: config.videoObjectFit,
    useVideoPreview: config.useVideoPreview,
    buttonSize: config.buttonSize,
    previewVideoHeight: config.previewVideoHeight,
    // Live chat fields
    liveChatEnabled: config.liveChatEnabled,
    liveChatGreeting: config.liveChatGreeting,
    liveChatColor: config.liveChatColor,
    liveChatRequireEmail: config.liveChatRequireEmail,
    liveChatRequireName: config.liveChatRequireName,
    liveChatRequirePhone: config.liveChatRequirePhone,
    liveChatCustomFields: config.liveChatCustomFields,
    liveChatButtonText: config.liveChatButtonText
  }

  console.log('Template config created with video preview settings:', {
    templateId: templateId,
    channels: templateConfig.channels.length,
    buttonColor: templateConfig.buttonColor,
    position: templateConfig.position,
    greetingMessage: templateConfig.greetingMessage,
    videoEnabled: templateConfig.videoEnabled,
    useVideoPreview: templateConfig.useVideoPreview,
    previewVideoHeight: templateConfig.previewVideoHeight
  })

  const renderer = new WidgetTemplateRenderer(template, templateConfig)
  const script = renderer.generateWidgetScript()
  
  console.log('Widget script generated successfully:', {
    templateUsed: templateId,
    templateName: template.name,
    scriptLength: script.length,
    hasChannels: templateConfig.channels.length > 0,
    greetingMessage: templateConfig.greetingMessage,
    videoPreviewEnabled: templateConfig.useVideoPreview
  })
  
  return script
}

// Simplified version that doesn't need database access
export async function generateWidgetScriptWithTemplate(widget: any, supabaseClient?: any): string {
  // No longer needs database access - templates are file-based
  return generateWidgetScript(widget)
}
