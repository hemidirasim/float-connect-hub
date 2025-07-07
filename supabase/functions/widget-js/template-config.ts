
import type { WidgetConfig } from './types.ts'

export function createWidgetConfig(widget: any): WidgetConfig {
  console.log('Creating widget config from database data:', {
    video_enabled: widget.video_enabled,
    video_url: widget.video_url,
    preview_video_height: widget.preview_video_height,
    button_size: widget.button_size,
    live_chat_enabled: widget.live_chat_enabled,
    live_chat_agent_name: widget.live_chat_agent_name
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
    useVideoPreview: Boolean(widget.video_enabled), // Use video_enabled as useVideoPreview
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120,
    templateId: widget.template_id || 'default',
    // Live chat fields
    liveChatEnabled: Boolean(widget.live_chat_enabled),
    liveChatAgentName: widget.live_chat_agent_name || 'Support Agent',
    liveChatGreeting: widget.live_chat_greeting || 'Hello! How can we help you today?',
    liveChatColor: widget.live_chat_color || '#4f46e5',
    liveChatAutoOpen: Boolean(widget.live_chat_auto_open),
    liveChatOfflineMessage: widget.live_chat_offline_message || 'We are currently offline. Please leave a message and we will get back to you.',
    // Pre-chat form fields
    liveChatRequireEmail: Boolean(widget.live_chat_require_email),
    liveChatRequireName: Boolean(widget.live_chat_require_name),
    liveChatRequirePhone: Boolean(widget.live_chat_require_phone),
    liveChatCustomFields: widget.live_chat_custom_fields || '',
    liveChatButtonText: widget.live_chat_button_text || 'Start Live Chat'
  }

  console.log('Final widget config created:', {
    videoEnabled: config.videoEnabled,
    useVideoPreview: config.useVideoPreview,
    previewVideoHeight: config.previewVideoHeight,
    buttonSize: config.buttonSize,
    templateId: config.templateId,
    liveChatEnabled: config.liveChatEnabled,
    liveChatAgentName: config.liveChatAgentName
  })

  return config
}
