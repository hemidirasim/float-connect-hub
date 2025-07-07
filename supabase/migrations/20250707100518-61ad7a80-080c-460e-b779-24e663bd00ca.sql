
-- Add agent name column to widgets table for live chat
ALTER TABLE public.widgets 
ADD COLUMN live_chat_agent_name TEXT;
