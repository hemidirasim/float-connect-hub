
import type { WidgetConfig } from './types.ts'

export function createWidgetConfig(widget: any): WidgetConfig {
  console.log('Creating widget config from database data:', {
    video_enabled: widget.video_enabled,
    video_url: widget.video_url,
    preview_video_height: widget.preview_video_height,
    button_size: widget.button_size,
    live_chat_enabled: widget.live_chat_enabled
  })

  // Parse channels with fallback
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

  const config: WidgetConfig = {
    channels: channels,
    buttonColor: widget.button_color || '#25d366',
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
    useVideoPreview: Boolean(widget.video_enabled),
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120,
    templateId: widget.template_id || 'default',
    // Live chat settings (removed position)
    liveChatEnabled: Boolean(widget.live_chat_enabled),
    liveChatGreeting: widget.live_chat_greeting || 'Hello! How can we help you today?',
    liveChatColor: widget.live_chat_color || '#4f46e5',
    liveChatAutoOpen: Boolean(widget.live_chat_auto_open),
    liveChatOfflineMessage: widget.live_chat_offline_message || 'We are currently offline. Please leave a message and we will get back to you.'
  }

  console.log('Final widget config created:', {
    videoEnabled: config.videoEnabled,
    useVideoPreview: config.useVideoPreview,
    previewVideoHeight: config.previewVideoHeight,
    buttonSize: config.buttonSize,
    templateId: config.templateId,
    liveChatEnabled: config.liveChatEnabled
  })

  return config
}
