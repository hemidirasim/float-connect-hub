
-- Add new columns for tooltip position and greeting message
ALTER TABLE public.widgets 
ADD COLUMN tooltip_position TEXT DEFAULT 'top',
ADD COLUMN greeting_message TEXT DEFAULT 'Hello! How can we help you today?';

-- Update existing widgets with default values
UPDATE public.widgets 
SET tooltip_position = 'top', 
    greeting_message = 'Hello! How can we help you today?' 
WHERE tooltip_position IS NULL OR greeting_message IS NULL;
