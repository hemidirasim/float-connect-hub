
import type { WidgetConfig } from './types.ts'
import { defaultWidgetConfig } from './config.ts'

export function createWidgetConfig(widget: any): WidgetConfig {
  console.log('Creating widget config from widget data:', {
    template_id: widget.template_id,
    templateId: widget.templateId,
    name: widget.name,
    greeting_message: widget.greeting_message,
    tooltip_position: widget.tooltip_position,
    raw_template_fields: {
      template_id: widget.template_id,
      templateId: widget.templateId
    }
  })
  
  // Determine the template ID to use
  let finalTemplateId = 'default'
  
  if (widget.template_id && typeof widget.template_id === 'string' && widget.template_id.trim() !== '') {
    finalTemplateId = widget.template_id.trim()
    console.log('Using template_id from widget:', finalTemplateId)
  } else if (widget.templateId && typeof widget.templateId === 'string' && widget.templateId.trim() !== '') {
    finalTemplateId = widget.templateId.trim()
    console.log('Using templateId from widget:', finalTemplateId)
  } else {
    console.log('No template ID found, defaulting to:', finalTemplateId)
  }
  
  const config: WidgetConfig = {
    channels: widget.channels || [],
    buttonColor: widget.button_color || defaultWidgetConfig.buttonColor,
    position: widget.position || defaultWidgetConfig.position,
    tooltip: widget.tooltip || defaultWidgetConfig.tooltip,
    tooltipDisplay: widget.tooltip_display || defaultWidgetConfig.tooltipDisplay,
    tooltipPosition: widget.tooltip_position || 'top',
    greetingMessage: widget.greeting_message || 'Hello! How can we help you todayy?',
    customIconUrl: widget.custom_icon_url || defaultWidgetConfig.customIconUrl,
    videoEnabled: widget.video_enabled || defaultWidgetConfig.videoEnabled,
    videoUrl: widget.video_url || defaultWidgetConfig.videoUrl,
    videoHeight: widget.video_height || defaultWidgetConfig.videoHeight,
    videoAlignment: widget.video_alignment || defaultWidgetConfig.videoAlignment,
    useVideoPreview: widget.use_video_preview || false,
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120,
    templateId: finalTemplateId
  }
  
  console.log('Widget config created with final templateId and greeting message:', {
    templateId: config.templateId,
    greetingMessage: config.greetingMessage,
    tooltipPosition: config.tooltipPosition
  })
  
  return config
}
