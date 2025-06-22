
import type { Channel } from '../types.ts'

export interface TemplateConfig {
  channels: Channel[]
  buttonColor: string
  position: string
  tooltip: string
  tooltipDisplay: string
  tooltipPosition?: string
  greetingMessage?: string
  customIconUrl?: string
  videoEnabled: boolean
  videoUrl?: string
  videoHeight: number
  videoAlignment: string
  useVideoPreview: boolean
  buttonSize: number
  previewVideoHeight: number
}
