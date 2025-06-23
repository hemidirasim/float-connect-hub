
-- Add missing columns to widgets table
ALTER TABLE public.widgets 
ADD COLUMN IF NOT EXISTS button_size integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS preview_video_height integer DEFAULT 120;
