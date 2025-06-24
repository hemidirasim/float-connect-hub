-- First add a unique constraint on the name column
ALTER TABLE public.widget_templates 
ADD CONSTRAINT widget_templates_name_key UNIQUE (name);

-- Ensure Modern Clean Template exists
INSERT INTO public.widget_templates (
  id, 
  name, 
  description, 
  html_template, 
  css_template, 
  js_template, 
  is_active, 
  is_default
)
VALUES (
  gen_random_uuid(), 
  'Modern Clean Template', 
  'Modern and clean floating widget with green accent', 
  '<!-- Default template HTML -->', 
  '/* Default template CSS */', 
  '// Default template JavaScript', 
  true, 
  true
)
ON CONFLICT (name) DO NOTHING;

-- Ensure Minimalist Template exists
INSERT INTO public.widget_templates (
  id, 
  name, 
  description, 
  html_template, 
  css_template, 
  js_template, 
  is_active, 
  is_default
)
VALUES (
  gen_random_uuid(), 
  'Minimalist', 
  'Minimalist template with circular buttons and simple icons', 
  '<!-- Minimalist template HTML -->', 
  '/* Minimalist template CSS */', 
  '// Minimalist template with circular buttons and simple icons', 
  true, 
  false
)
ON CONFLICT (name) DO NOTHING;

-- Set template_id for widgets that don't have one
UPDATE public.widgets
SET template_id = (SELECT id FROM public.widget_templates WHERE name = 'Modern Clean Template' LIMIT 1)
WHERE template_id IS NULL;

-- Keep only the default and minimalist templates
DELETE FROM public.widget_templates 
WHERE name NOT IN ('Modern Clean Template', 'Minimalist');