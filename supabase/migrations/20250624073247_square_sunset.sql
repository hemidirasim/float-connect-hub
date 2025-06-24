/*
  # Update minimalist template

  1. Changes
     - Update minimalist template to match the provided design
     - Ensure template_id field is properly set for widgets
  
  2. Template Updates
     - Update HTML, CSS, and JS for minimalist template
     - Set template as active
*/

-- First, update the default template description
UPDATE public.widget_templates
SET description = 'Modern and clean floating widget with green accent'
WHERE name = 'Default Template' OR name = 'Modern Clean Template';

-- Update existing minimalist template if it exists
UPDATE public.widget_templates
SET 
  html_template = '<!-- Minimalist template with circular buttons and simple icons -->',
  css_template = '/* Minimalist template with circular buttons and simple icons */',
  js_template = '// Minimalist template with circular buttons and simple icons',
  description = 'Simple icons-only design with circular buttons and hover tooltips',
  is_active = true
WHERE name = 'Minimalist';

-- Insert minimalist template if it doesn't exist
INSERT INTO public.widget_templates (id, name, description, html_template, css_template, js_template, is_active, is_default)
SELECT 
  gen_random_uuid(), 
  'Minimalist', 
  'Simple icons-only design with circular buttons and hover tooltips',
  '<!-- Minimalist template with circular buttons and simple icons -->', 
  '/* Minimalist template with circular buttons and simple icons */', 
  '// Minimalist template with circular buttons and simple icons',
  true,
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.widget_templates WHERE name = 'Minimalist'
);

-- Set template_id for widgets that don't have one
UPDATE public.widgets
SET template_id = (SELECT id FROM public.widget_templates WHERE name = 'Default Template' OR name = 'Modern Clean Template' LIMIT 1)
WHERE template_id IS NULL;

-- Keep only the default and minimalist templates
DELETE FROM public.widget_templates 
WHERE name NOT IN ('Default Template', 'Modern Clean Template', 'Minimalist');