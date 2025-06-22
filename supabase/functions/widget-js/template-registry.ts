
import { getDefaultTemplate } from './default-template.ts'
import { getDarkTemplate } from './templates/dark-template.ts'
import { getMinimalTemplate } from './templates/minimal-template.ts'
import { getModernTemplate } from './templates/modern-template.ts'
import { getElegantTemplate } from './templates/elegant-template.ts'
import type { WidgetTemplate } from './template-types.ts'

// Available templates registry
export const TEMPLATE_REGISTRY = {
  'default': getDefaultTemplate,
  'dark': getDarkTemplate,
  'minimal': getMinimalTemplate,
  'modern': getModernTemplate,
  'elegant': getElegantTemplate
} as const

export type TemplateId = keyof typeof TEMPLATE_REGISTRY

// Get template by ID
export function getTemplateById(templateId: string): WidgetTemplate {
  const templateFunction = TEMPLATE_REGISTRY[templateId as TemplateId]
  if (templateFunction) {
    return templateFunction()
  }
  
  // Fallback to default template
  console.log(`Template '${templateId}' not found, using default template`)
  return getDefaultTemplate()
}

// Get all available templates (for frontend)
export function getAllTemplates(): WidgetTemplate[] {
  return Object.keys(TEMPLATE_REGISTRY).map(id => getTemplateById(id))
}

// Check if template exists
export function isValidTemplateId(templateId: string): boolean {
  return templateId in TEMPLATE_REGISTRY
}
