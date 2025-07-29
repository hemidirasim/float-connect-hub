
import type { WidgetConfig } from './types.ts'

export function createWidgetConfig(widget: any): WidgetConfig {
  console.log('Creating widget config from database data:', {
    video_enabled: widget.video_enabled,
    video_url: widget.video_url,
    preview_video_height: widget.preview_video_height,
    button_size: widget.button_size
  })

  // Parse channels with fallback and ensure customIcon is preserved
  let channels = []
  if (widget.channels) {
    if (typeof widget.channels === 'string') {
      try {
        channels = JSON.parse(widget.channels)
      } catch (e) {
        console.error('Error parsing channels JSON:', e)
        channels = []
      }
    } else if (Array.isArray(widget.channels)) {
      channels = widget.channels
    }
  }

  // Ensure all channels have proper structure and preserve customIcon
  channels = channels.map((channel: any) => ({
    ...channel,
    customIcon: channel.customIcon || undefined,
    childChannels: (channel.childChannels || []).map((child: any) => ({
      ...child,
      customIcon: child.customIcon || undefined
    }))
  }))

  console.log('Parsed channels with custom icons:', channels.map((ch: any) => ({
    type: ch.type,
    label: ch.label,
    hasCustomIcon: !!ch.customIcon,
    customIcon: ch.customIcon
  })))

  const config: WidgetConfig = {
    channels: channels,
    buttonColor: widget.button_color || '#5422c9',
    position: widget.position || 'right',
    tooltip: widget.tooltip || 'Contact us!',
    tooltipDisplay: widget.tooltip_display || 'hover',
    tooltipPosition: widget.tooltip_position || 'top',
    greetingMessage: widget.greeting_message || 'Hello! How can we help you today?',
    customIconUrl: widget.custom_icon_url || undefined,
    videoEnabled: Boolean(widget.video_enabled),
    videoUrl: widget.video_url || undefined,
    videoHeight: widget.video_height || 200,
    videoAlignment: widget.video_alignment || 'center',
    videoObjectFit: widget.video_object_fit || 'cover',
    useVideoPreview: Boolean(widget.video_enabled), // Use video_enabled as useVideoPreview
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120,
    templateId: widget.template_id || 'default'
  }

  console.log('Final widget config created:', {
    videoEnabled: config.videoEnabled,
    useVideoPreview: config.useVideoPreview,
    previewVideoHeight: config.previewVideoHeight,
    buttonSize: config.buttonSize,
    templateId: config.templateId
  })

  return config
}
