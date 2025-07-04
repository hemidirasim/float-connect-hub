
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
  const position = config.position
  
  // Calculate button offset to adjust tooltip position accordingly
  const tooltipText = config.tooltip || ''
  const approximateTooltipWidth = Math.max(120, tooltipText.length * 8)
  
  let adjustedStyle = ''
  
  switch (tooltipPosition) {
    case 'top':
      adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
      
      // Adjust for right tooltip on right-positioned button
      if (position === 'right') {
        const offsetX = -(approximateTooltipWidth / 2)
        adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: calc(50% + ${offsetX}px); transform: translateX(-50%); margin-bottom: 0;`
      }
      
      // Adjust for left tooltip on left-positioned button
      if (position === 'left') {
        const offsetX = approximateTooltipWidth / 2
        adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: calc(50% + ${offsetX}px); transform: translateX(-50%); margin-bottom: 0;`
      }
      break
      
    case 'bottom':
      adjustedStyle = `top: ${buttonSize + tooltipOffset - 40}px; left: 50%; transform: translateX(-50%); margin-top: 0;`
      
      // Adjust for right tooltip on right-positioned button
      if (position === 'right') {
        const offsetX = -(approximateTooltipWidth / 2)
        adjustedStyle = `top: ${buttonSize + tooltipOffset - 40}px; left: calc(50% + ${offsetX}px); transform: translateX(-50%); margin-top: 0;`
      }
      
      // Adjust for left tooltip on left-positioned button
      if (position === 'left') {
        const offsetX = approximateTooltipWidth / 2
        adjustedStyle = `top: ${buttonSize + tooltipOffset - 40}px; left: calc(50% + ${offsetX}px); transform: translateX(-50%); margin-top: 0;`
      }
      break
      
    case 'left':
      if (position === 'left') {
        // When tooltip is on left and button is on left, move tooltip to right side of button
        adjustedStyle = `left: ${buttonSize + tooltipOffset + approximateTooltipWidth / 2}px; top: 50%; transform: translateY(-50%);`
      } else {
        adjustedStyle = `right: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
      }
      break
      
    case 'right':
      if (position === 'right') {
        // When tooltip is on right and button is on right, move tooltip to left side of button
        adjustedStyle = `right: ${buttonSize + tooltipOffset + approximateTooltipWidth / 2}px; top: 50%; transform: translateY(-50%);`
      } else {
        adjustedStyle = `left: ${buttonSize + tooltipOffset}px; top: 50%; transform: translateY(-50%);`
      }
      break
      
    default:
      adjustedStyle = `bottom: ${buttonSize + tooltipOffset}px; left: 50%; transform: translateX(-50%); margin-bottom: 0;`
  }
  
  return adjustedStyle
}

// New function to adjust button position when tooltip might go off-screen
export function getButtonOffsetStyle(config: TemplateConfig): string {
  const tooltipPosition = config.tooltipPosition || 'top'
  const position = config.position
  
  // Calculate approximate tooltip width (rough estimate)
  const tooltipText = config.tooltip || ''
  const approximateTooltipWidth = Math.max(120, tooltipText.length * 8)
  
  let offsetX = 0
  let offsetY = 0
  
  // Adjust for right tooltip on right-positioned button
  if (tooltipPosition === 'right' && position === 'right') {
    offsetX = -(approximateTooltipWidth / 2) // Push button left
  }
  
  // Adjust for left tooltip on left-positioned button  
  if (tooltipPosition === 'left' && position === 'left') {
    offsetX = approximateTooltipWidth / 2 // Push button right
  }
  
  // Adjust for bottom tooltip
  if (tooltipPosition === 'bottom') {
    offsetY = -40 // Push button up
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
