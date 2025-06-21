
import type { WidgetConfig } from './types.ts'
import { defaultWidgetConfig } from './config.ts'

export function createWidgetConfig(widget: any): WidgetConfig {
  return {
    channels: widget.channels || [],
    buttonColor: widget.button_color || defaultWidgetConfig.buttonColor,
    position: widget.position || defaultWidgetConfig.position,
    tooltip: widget.tooltip || defaultWidgetConfig.tooltip,
    tooltipDisplay: widget.tooltip_display || defaultWidgetConfig.tooltipDisplay,
    customIconUrl: widget.custom_icon_url || defaultWidgetConfig.customIconUrl,
    videoEnabled: widget.video_enabled || defaultWidgetConfig.videoEnabled,
    videoUrl: widget.video_url || defaultWidgetConfig.videoUrl,
    videoHeight: widget.video_height || defaultWidgetConfig.videoHeight,
    videoAlignment: widget.video_alignment || defaultWidgetConfig.videoAlignment,
    useVideoPreview: widget.use_video_preview || false,
    buttonSize: widget.button_size || 60,
    previewVideoHeight: widget.preview_video_height || 120
  }
}
