
import type { WidgetConfig } from './types.ts'
import { createWidgetConfig } from './template-config.ts'
import { getDefaultTemplate } from './default-template.ts'
import { WidgetTemplateRenderer, type TemplateConfig } from './template-generator.ts'

export function generateWidgetScript(widget: any): string {
  const config = createWidgetConfig(widget)
  const template = getDefaultTemplate()

  console.log('Generating script with template for config:', JSON.stringify(config, null, 2))

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
