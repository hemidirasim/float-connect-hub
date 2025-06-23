
import type { WidgetTemplate } from './template-types.ts'
import { defaultHtmlTemplate } from './templates/default/html-template.ts'
import { defaultCssStyles } from './templates/default/css-styles.ts'
import { defaultJavaScriptLogic } from './templates/default/javascript-logic.ts'

export const defaultTemplate: WidgetTemplate = {
  id: 'default',
  name: 'Modern Clean Template', 
  description: 'Modern and clean floating widget with green accent',
  html: defaultHtmlTemplate,
  css: defaultCssStyles,
  js: defaultJavaScriptLogic
};

export const getDefaultTemplate = () => defaultTemplate;
