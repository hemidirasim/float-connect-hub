/*
  # Update widget templates

  1. Changes
     - Updates the description for the default template
     - Adds a new minimalist template with icons-only design
     - Removes all other templates except default and minimalist

  2. Template Details
     - Default: Modern and clean floating widget with green accent
     - Minimalist: Simple icons-only design with hover tooltips
*/

-- First, update the default template description
UPDATE public.widget_templates
SET description = 'Modern and clean floating widget with green accent'
WHERE name = 'Default Template' OR name = 'Modern Clean Template';

-- Then, add the minimalist template if it doesn't exist
INSERT INTO public.widget_templates (id, name, description, html_template, css_template, js_template, is_active, is_default)
SELECT 
  gen_random_uuid(), 
  'Minimalist', 
  'Simple icons-only design with hover tooltips',
  '<!-- Minimalist template HTML placeholder -->', 
  '/* Minimalist template CSS placeholder */', 
  '// Minimalist template JS placeholder',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.widget_templates WHERE name = 'Minimalist'
);

-- Keep only the default and minimalist templates
DELETE FROM public.widget_templates 
WHERE name NOT IN ('Default Template', 'Modern Clean Template', 'Minimalist');