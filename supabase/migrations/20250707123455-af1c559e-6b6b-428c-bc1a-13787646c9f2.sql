-- Add live_chat_button_text column to widgets table
ALTER TABLE public.widgets 
ADD COLUMN live_chat_button_text text DEFAULT 'Start Live Chat';