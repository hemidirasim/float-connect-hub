/*
  # Widget Templates Setup

  1. New Tables
    - Ensures widget_templates has required entries
  2. Changes
    - Adds unique constraint on name column if not exists
    - Inserts default templates
    - Updates widgets without template_id
    - Cleans up unused templates
*/

-- First, ensure name column has a unique constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'widget_templates_name_key' 
    AND conrelid = 'widget_templates'::regclass
  ) THEN
    ALTER TABLE public.widget_templates ADD CONSTRAINT widget_templates_name_key UNIQUE (name);
  END IF;
END $$;

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