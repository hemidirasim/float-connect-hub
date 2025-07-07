
-- Live chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_id UUID NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL, -- Anonymous visitor identifier
  visitor_name TEXT,
  visitor_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'waiting')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  user_agent TEXT,
  ip_address TEXT
);

-- Live chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('visitor', 'agent')),
  sender_id UUID, -- User ID if agent, null if visitor
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add live chat settings to widgets table
ALTER TABLE public.widgets 
ADD COLUMN live_chat_enabled BOOLEAN DEFAULT false,
ADD COLUMN live_chat_greeting TEXT DEFAULT 'Hello! How can we help you today?',
ADD COLUMN live_chat_color TEXT DEFAULT '#4f46e5',
ADD COLUMN live_chat_position TEXT DEFAULT 'bottom-right' CHECK (live_chat_position IN ('bottom-right', 'bottom-left')),
ADD COLUMN live_chat_auto_open BOOLEAN DEFAULT false,
ADD COLUMN live_chat_offline_message TEXT DEFAULT 'We are currently offline. Please leave a message and we will get back to you.';

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_widget_id ON public.chat_sessions(widget_id);
CREATE INDEX idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Row Level Security policies
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat sessions policies
CREATE POLICY "Widget owners can view their chat sessions" 
  ON public.chat_sessions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.widgets 
      WHERE widgets.id = chat_sessions.widget_id 
      AND widgets.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage chat sessions" 
  ON public.chat_sessions 
  FOR ALL 
  USING (true);

-- Chat messages policies  
CREATE POLICY "Widget owners can view messages for their sessions" 
  ON public.chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions cs
      JOIN public.widgets w ON w.id = cs.widget_id
      WHERE cs.id = chat_messages.session_id 
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage chat messages" 
  ON public.chat_messages 
  FOR ALL 
  USING (true);

-- Function to create a new chat session
CREATE OR REPLACE FUNCTION public.create_chat_session(
  p_widget_id UUID,
  p_visitor_id TEXT,
  p_visitor_name TEXT DEFAULT NULL,
  p_visitor_email TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO public.chat_sessions (
    widget_id, visitor_id, visitor_name, visitor_email, user_agent, ip_address
  ) VALUES (
    p_widget_id, p_visitor_id, p_visitor_name, p_visitor_email, p_user_agent, p_ip_address
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Function to send a message
CREATE OR REPLACE FUNCTION public.send_chat_message(
  p_session_id UUID,
  p_sender_type TEXT,
  p_sender_id UUID DEFAULT NULL,
  p_message TEXT,
  p_message_type TEXT DEFAULT 'text'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  message_id UUID;
BEGIN
  INSERT INTO public.chat_messages (
    session_id, sender_type, sender_id, message, message_type
  ) VALUES (
    p_session_id, p_sender_type, p_sender_id, p_message, p_message_type
  ) RETURNING id INTO message_id;
  
  -- Update session timestamp
  UPDATE public.chat_sessions 
  SET updated_at = now() 
  WHERE id = p_session_id;
  
  RETURN message_id;
END;
$$;
