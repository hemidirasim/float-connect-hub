
import type { TemplateConfig } from './types.ts'

export function getPositionStyle(position: string): string {
  switch (position) {
    case 'left':
      return 'left: 20px;'
    case 'center':
      return 'left: 50%; transform: translateX(-50%);'
    case 'right':
    default:
      return 'right: 20px;'
  }
}

export function getTooltipPositionStyle(config: TemplateConfig): string {
  const buttonSize = config.buttonSize || 60
  const tooltipOffset = 8
  
  switch (config.tooltipPosition || 'top') {
    case 'top':
      return `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
    case 'bottom':
      return `top: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-top: 0;`
    case 'left':
      return `right: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
    case 'right':
      return `left: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
    default:
      return `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
  }
}
