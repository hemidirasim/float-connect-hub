
-- Add video_height and video_alignment columns to widgets table
ALTER TABLE public.widgets 
ADD COLUMN video_height INTEGER DEFAULT 200,
ADD COLUMN video_alignment TEXT DEFAULT 'center';
