-- Create chat sessions table
CREATE TABLE public.chat_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_id uuid NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  visitor_email text,
  visitor_phone text,
  custom_fields jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'abandoned')),
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone,
  last_message_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add session_id to live_chat_messages table
ALTER TABLE public.live_chat_messages 
ADD COLUMN session_id uuid REFERENCES public.chat_sessions(id) ON DELETE CASCADE;

-- Enable RLS for chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for chat sessions
CREATE POLICY "Widget owners can view their chat sessions" 
ON public.chat_sessions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM widgets 
  WHERE widgets.id = chat_sessions.widget_id 
  AND widgets.user_id = auth.uid()
));

CREATE POLICY "Widget owners can update their chat sessions" 
ON public.chat_sessions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM widgets 
  WHERE widgets.id = chat_sessions.widget_id 
  AND widgets.user_id = auth.uid()
));

CREATE POLICY "Anyone can create chat sessions" 
ON public.chat_sessions 
FOR INSERT 
WITH CHECK (true);

-- Create function to update last_message_at
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions 
  SET last_message_at = NEW.created_at, updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating last message time
CREATE TRIGGER update_session_last_message_trigger
AFTER INSERT ON public.live_chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_session_last_message();

-- Create index for better performance
CREATE INDEX idx_chat_sessions_widget_id ON public.chat_sessions(widget_id);
CREATE INDEX idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX idx_live_chat_messages_session_id ON public.live_chat_messages(session_id);