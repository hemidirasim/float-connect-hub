
import type { WidgetTemplate } from '../template-types.ts'
import { modernHtml } from './modern/html.ts'
import { modernCss } from './modern/css.ts'
import { modernJs } from './modern/javascript.ts'

export const getModernTemplate = (): WidgetTemplate => ({
  id: 'modern',
  name: 'Modern Gradient',
  description: 'Modern template with gradient effects and smooth animations',
  html: modernHtml,
  css: modernCss,
  js: modernJs
});
