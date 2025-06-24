/*
  # Update Minimalist Widget Template

  1. New Template
    - Updates the existing 'Minimalist' template with improved specifications
    - Ensures template is active and available for selection
  
  2. Widget Configuration
    - Sets default template for widgets without a template_id
    - Maintains only necessary templates in the database
*/

-- Update minimalist template with complete specifications
UPDATE public.widget_templates
SET 
  html_template = '<!-- Minimalist Widget Template: Simple, clean design with circular buttons and minimal visual elements -->',
  css_template = '/* Minimalist Widget Template: Focused on simplicity with a clean aesthetic */',
  js_template = '// Minimalist Widget Template: Streamlined functionality with smooth interactions',
  description = 'Clean, icon-based design with circular buttons and subtle animations',
  preview_image_url = 'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=300',
  is_active = true
WHERE name = 'Minimalist';

-- Insert minimalist template if it doesn't exist
INSERT INTO public.widget_templates (id, name, description, html_template, css_template, js_template, is_active, is_default, preview_image_url)
SELECT 
  gen_random_uuid(), 
  'Minimalist', 
  'Clean, icon-based design with circular buttons and subtle animations',
  '<!-- Minimalist Widget Template: Simple, clean design with circular buttons and minimal visual elements -->', 
  '/* Minimalist Widget Template: Focused on simplicity with a clean aesthetic */', 
  '// Minimalist Widget Template: Streamlined functionality with smooth interactions',
  true,
  false,
  'https://images.pexels.com/photos/5417837/pexels-photo-5417837.jpeg?auto=compress&cs=tinysrgb&w=300'
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