
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
  const tooltipOffset = 12
  const tooltipPosition = config.tooltipPosition || 'top'
  
  let adjustedStyle = ''
  
  switch (tooltipPosition) {
    case 'top':
      adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%);`
      break
      
    case 'bottom':
      adjustedStyle = `top: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%);`
      break
      
    case 'left':
      adjustedStyle = `right: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
      break
      
    case 'right':
      adjustedStyle = `left: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
      break
      
    default:
      adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%);`
  }
  
  return adjustedStyle
}

// Button-u tooltip pozisiyasına əsasən hərəkət etdirəcəyəm
export function getButtonOffsetStyle(config: TemplateConfig): string {
  const tooltipPosition = config.tooltipPosition || 'top'
  const offsetAmount = 15 // Button-un hərəkət məsafəsi
  
  switch (tooltipPosition) {
    case 'top':
      return `transform: translateY(${offsetAmount}px);` // Aşağı hərəkət
    case 'bottom':
      return `transform: translateY(-${offsetAmount}px);` // Yuxarı hərəkət
    case 'left':
      return `transform: translateX(${offsetAmount}px);` // Sağa hərəkət
    case 'right':
      return `transform: translateX(-${offsetAmount}px);` // Sola hərəkət
    default:
      return `transform: translateY(${offsetAmount}px);`
  }
}

export function getModalPositionStyle(position: string): string {
  switch (position) {
    case 'left':
      return 'align-items: flex-end; justify-content: flex-start;'
    case 'center':
      return 'align-items: flex-end; justify-content: center;'
    case 'right':
    default:
      return 'align-items: flex-end; justify-content: flex-end;'
  }
}

export function getModalContentPositionStyle(position: string): string {
  switch (position) {
    case 'left':
      return 'bottom: 20px; left: 20px; position: absolute;'
    case 'center':
      return 'bottom: 20px; position: relative; margin: 0 auto;'
    case 'right':
    default:
      return 'bottom: 20px; right: 20px; position: absolute;'
  }
}
