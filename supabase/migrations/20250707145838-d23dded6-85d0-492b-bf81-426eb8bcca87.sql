-- Enable realtime for live_chat_messages table
ALTER TABLE public.live_chat_messages REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;