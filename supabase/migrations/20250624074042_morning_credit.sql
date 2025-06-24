/*
  # Update widget templates

  1. Updates
    - Updates existing Minimalist template if it exists
    - Inserts Minimalist template if it doesn't exist
    - Sets template_id for widgets that don't have one
    - Keeps only default and minimalist templates
*/

-- Update minimalist template if it exists
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