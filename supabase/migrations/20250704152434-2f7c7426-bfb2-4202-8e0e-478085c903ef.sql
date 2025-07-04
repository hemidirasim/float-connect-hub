
-- Add new columns to widgets table for video object-fit and widget dimensions
ALTER TABLE public.widgets 
ADD COLUMN video_object_fit text DEFAULT 'cover',
ADD COLUMN widget_width integer DEFAULT 400,
ADD COLUMN widget_height integer DEFAULT 600;

-- Update the column comments for clarity
COMMENT ON COLUMN public.widgets.video_object_fit IS 'CSS object-fit property for video: contain, cover, fill';
COMMENT ON COLUMN public.widgets.widget_width IS 'Width of the widget modal in pixels';
COMMENT ON COLUMN public.widgets.widget_height IS 'Height of the widget modal in pixels';
