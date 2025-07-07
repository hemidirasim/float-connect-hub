
-- Add missing live chat columns to widgets table
ALTER TABLE public.widgets 
ADD COLUMN live_chat_enabled BOOLEAN DEFAULT false,
ADD COLUMN live_chat_greeting TEXT DEFAULT 'Hello! How can we help you today?',
ADD COLUMN live_chat_color TEXT DEFAULT '#4f46e5',
ADD COLUMN live_chat_auto_open BOOLEAN DEFAULT false,
ADD COLUMN live_chat_offline_message TEXT DEFAULT 'We are currently offline. Please leave a message and we will get back to you.';
