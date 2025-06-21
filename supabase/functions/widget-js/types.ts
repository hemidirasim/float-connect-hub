
export interface WidgetConfig {
  channels: Array<{
    id: string
    type: string
    value: string
    label: string
  }>
  buttonColor: string
  position: 'left' | 'right'
  tooltip: string
  tooltipDisplay: 'always' | 'hover' | 'never'
  customIconUrl?: string
  videoEnabled: boolean
  videoUrl?: string
  videoHeight: number
  videoAlignment: string
  useVideoPreview?: boolean
  buttonSize?: number
  previewVideoHeight?: number
}
