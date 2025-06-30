
import type { TemplateConfig } from './renderer/types.ts'
import type { Channel } from './types.ts'

export function createWidgetConfig(widget: any): TemplateConfig {
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

  // Determine template ID from multiple possible sources
  let templateId = 'default'
  
  if (widget.template_id && typeof widget.template_id === 'string' && widget.template_id.trim() !== '') {
    templateId = widget.template_id.trim()
    console.log('Using template_id from widget:', templateId)
  } else if (widget.templateId && typeof widget.templateId === 'string' && widget.templateId.trim() !== '') {
    templateId = widget.templateId.trim()
    console.log('Using templateId from widget:', templateId)
  }

  // Automatically enable video if video_url exists
  const hasVideoUrl = Boolean(widget.video_url && widget.video_url.trim() !== '')
  const videoEnabled = hasVideoUrl || Boolean(widget.video_enabled)

  console.log('Video configuration:', {
    hasVideoUrl,
    video_url: widget.video_url,
    video_enabled: widget.video_enabled,
    finalVideoEnabled: videoEnabled
  })

  const config: TemplateConfig = {
    channels: widget.channels || [],
    buttonColor: widget.button_color || '#25d366',
    position: widget.position || 'right',
    tooltip: widget.tooltip || 'Contact us!',
    tooltipDisplay: widget.tooltip_display || 'hover',
    tooltipPosition: widget.tooltip_position || 'top',
    greetingMessage: widget.greeting_message || 'Hello! How can we help you today?',
    customIconUrl: widget.custom_icon_url || null,
    videoEnabled: videoEnabled,
    videoUrl: widget.video_url || null,
    videoHeight: widget.video_height || 200,
    videoAlignment: widget.video_alignment || 'center',
    useVideoPreview: widget.use_video_preview || false,
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120,
    templateId: templateId
  }

  console.log('Widget config created with final templateId and greeting message:', {
    templateId: config.templateId,
    greetingMessage: config.greetingMessage,
    tooltipPosition: config.tooltipPosition,
    videoEnabled: config.videoEnabled,
    videoUrl: config.videoUrl
  })

  return config
}
