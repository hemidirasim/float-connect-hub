
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
  const tooltipPosition = config.tooltipPosition || 'top'
  
  let adjustedStyle = ''
  
  switch (tooltipPosition) {
    case 'top':
      adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
      break
      
    case 'bottom':
      adjustedStyle = `top: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-top: 0;`
      break
      
    case 'left':
      adjustedStyle = `right: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
      break
      
    case 'right':
      adjustedStyle = `left: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
      break
      
    default:
      adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
  }
  
  return adjustedStyle
}

// Function to adjust button position to prevent tooltip from going off-screen
export function getButtonOffsetStyle(config: TemplateConfig): string {
  const tooltipPosition = config.tooltipPosition || 'top'
  const position = config.position
  
  // Calculate approximate tooltip width
  const tooltipText = config.tooltip || ''
  const approximateTooltipWidth = Math.max(120, tooltipText.length * 8)
  
  let offsetX = 0
  let offsetY = 0
  
  // Adjust button position based on tooltip position and widget position
  if (tooltipPosition === 'right' && position === 'right') {
    // Move button left to make space for right tooltip
    offsetX = -(approximateTooltipWidth / 2 + 10)
  }
  
  if (tooltipPosition === 'left' && position === 'left') {
    // Move button right to make space for left tooltip  
    offsetX = approximateTooltipWidth / 2 + 10
  }
  
  if (tooltipPosition === 'bottom') {
    // Move button up to make space for bottom tooltip
    offsetY = -50
  }
  
  if (tooltipPosition === 'top' && position === 'center') {
    // For center position, no horizontal offset needed
    offsetX = 0
  }
  
  if (offsetX !== 0 || offsetY !== 0) {
    return `transform: translate(${offsetX}px, ${offsetY}px);`
  }
  
  return ''
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
