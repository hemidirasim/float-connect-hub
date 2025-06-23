
-- First, drop the foreign key constraint
ALTER TABLE public.widgets 
DROP CONSTRAINT IF EXISTS widgets_template_id_fkey;

-- Change template_id column from UUID to TEXT to store template names as strings
ALTER TABLE public.widgets 
ALTER COLUMN template_id TYPE TEXT;

-- Update any existing UUID values to default string value
UPDATE public.widgets 
SET template_id = 'default' 
WHERE template_id IS NULL OR template_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Set default value for new records
ALTER TABLE public.widgets 
ALTER COLUMN template_id SET DEFAULT 'default';
