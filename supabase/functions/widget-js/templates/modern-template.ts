
import type { WidgetTemplate } from '../template-types.ts'
import { getModernHtmlTemplate } from './modern/html-template.ts'
import { getModernCssStyles } from './modern/css-styles.ts'
import { generateModernJavaScript } from './modern/js-generator.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Gradient',
  description: 'Modern template with gradient effects and smooth animations',
  html: getModernHtmlTemplate(),
  css: getModernCssStyles(),
  js: generateModernJavaScript()
});
