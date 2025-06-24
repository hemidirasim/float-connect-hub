import { getDefaultTemplate } from './default-template.ts'
import { getMinimalistTemplate } from './templates/minimalist-template.ts'
import type { WidgetTemplate } from './template-types.ts'

// Available templates registry
export const TEMPLATE_REGISTRY = {
  'default': getDefaultTemplate,
  'minimalist': getMinimalistTemplate
} as const

export type TemplateId = keyof typeof TEMPLATE_REGISTRY

// Get template by ID
export function getTemplateById(templateId: string): WidgetTemplate {
  console.log(`Getting template for ID: '${templateId}'`);
  
  const templateFunction = TEMPLATE_REGISTRY[templateId as TemplateId]
  if (templateFunction) {
    const template = templateFunction();
    console.log(`Template found: ${template.name}`);
    return template;
  }
  
  // Fallback to default template
  console.log(`Template '${templateId}' not found, using default template`);
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