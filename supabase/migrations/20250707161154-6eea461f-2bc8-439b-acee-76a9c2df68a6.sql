
-- Add unread_count column to chat_sessions table to track unread messages
ALTER TABLE public.chat_sessions 
ADD COLUMN unread_count INTEGER DEFAULT 0;

-- Create function to update unread count when new messages arrive
CREATE OR REPLACE FUNCTION public.update_session_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only increment unread count for visitor messages
  IF NEW.is_from_visitor = true THEN
    UPDATE public.chat_sessions 
    SET unread_count = unread_count + 1,
        last_message_at = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.session_id;
  ELSE
    -- For agent messages, just update last_message_at
    UPDATE public.chat_sessions 
    SET last_message_at = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.session_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update unread count
DROP TRIGGER IF EXISTS update_session_last_message ON public.live_chat_messages;
CREATE TRIGGER update_session_unread_count_trigger
  AFTER INSERT ON public.live_chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_session_unread_count();

-- Add function to mark session as read (reset unread count)
CREATE OR REPLACE FUNCTION public.mark_session_as_read(session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.chat_sessions 
  SET unread_count = 0,
      updated_at = now()
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
