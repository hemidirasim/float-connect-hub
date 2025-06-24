-- First, update the default template
UPDATE public.widget_templates
SET 
  name = 'Modern Clean Template',
  description = 'Modern and clean floating widget with green accent',
  is_active = true,
  is_default = true
WHERE name = 'Default Template' OR name = 'Modern Clean Template';

-- Update minimalist template if it exists
UPDATE public.widget_templates
SET 
  name = 'Minimalist',
  description = 'Clean, icon-based design with circular buttons and subtle animations',
  is_active = true,
  is_default = false
WHERE name = 'Minimalist';

-- Insert minimalist template if it doesn't exist
INSERT INTO public.widget_templates (id, name, description, html_template, css_template, js_template, is_active, is_default)
SELECT 
  gen_random_uuid(), 
  'Minimalist', 
  'Clean, icon-based design with circular buttons and subtle animations',
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
SET template_id = (SELECT id FROM public.widget_templates WHERE name = 'Modern Clean Template' LIMIT 1)
WHERE template_id IS NULL;

-- Keep only the default and minimalist templates
DELETE FROM public.widget_templates 
WHERE name NOT IN ('Modern Clean Template', 'Minimalist');