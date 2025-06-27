
-- Add tooltip display mode column to widgets table
ALTER TABLE public.widgets 
ADD COLUMN tooltip_display TEXT DEFAULT 'hover' CHECK (tooltip_display IN ('hover', 'always', 'never'));
