
-- Add live chat fields to widgets table
ALTER TABLE public.widgets 
ADD COLUMN IF NOT EXISTS live_chat_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS live_chat_agent_name text,
ADD COLUMN IF NOT EXISTS live_chat_greeting text DEFAULT 'Hello! How can we help you today?',
ADD COLUMN IF NOT EXISTS live_chat_color text DEFAULT '#4f46e5',
ADD COLUMN IF NOT EXISTS live_chat_auto_open boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS live_chat_offline_message text DEFAULT 'We are currently offline. Please leave a message and we will get back to you.';

-- Create table for live chat messages
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_id UUID NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_email text,
  message text NOT NULL,
  is_from_visitor boolean NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for live chat messages
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Widget owners can view messages for their widgets
CREATE POLICY "Widget owners can view their chat messages" 
  ON public.live_chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.widgets 
      WHERE widgets.id = live_chat_messages.widget_id 
      AND widgets.user_id = auth.uid()
    )
  );

-- Anyone can insert messages (for visitors)
CREATE POLICY "Anyone can send chat messages" 
  ON public.live_chat_messages 
  FOR INSERT 
  WITH CHECK (true);

-- Widget owners can respond to messages
CREATE POLICY "Widget owners can respond to messages" 
  ON public.live_chat_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.widgets 
      WHERE widgets.id = live_chat_messages.widget_id 
      AND widgets.user_id = auth.uid()
    )
  );
