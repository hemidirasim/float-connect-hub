/*
  # Update Widget Templates

  1. Changes
     - Remove unused templates
     - Keep only default and minimalist templates
     - Update template descriptions

  2. Security
     - No changes to security policies
*/

-- First, update the default template description
UPDATE public.widget_templates
SET description = 'Modern and clean floating widget with green accent'
WHERE id = 'default' OR name = 'Default Template';

-- Then, add the minimalist template if it doesn't exist
INSERT INTO public.widget_templates (id, name, description, html_template, css_template, js_template, is_active, is_default)
SELECT 
  'minimalist', 
  'Minimalist', 
  'Simple icons-only design with hover tooltips',
  '<!-- Minimalist template HTML placeholder -->', 
  '/* Minimalist template CSS placeholder */', 
  '// Minimalist template JS placeholder',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.widget_templates WHERE id = 'minimalist'
);

-- Remove all other templates except default and minimalist
DELETE FROM public.widget_templates 
WHERE id NOT IN ('default', 'minimalist');