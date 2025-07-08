import type { WidgetTemplate } from '../template-types.ts'
import { darkHtmlTemplate } from './dark/html-template.ts'
import { darkCssStyles } from './dark/css-styles.ts'
import { darkUtilityFunctions } from './dark/utility-functions.ts'

export const getDarkTemplate = (): WidgetTemplate => ({
  id: 'dark',
  name: 'Dark Theme',
  description: 'Modern dark-themed widget with sleek design',
  html: darkHtmlTemplate,
  css: darkCssStyles,
  js: darkUtilityFunctions
});