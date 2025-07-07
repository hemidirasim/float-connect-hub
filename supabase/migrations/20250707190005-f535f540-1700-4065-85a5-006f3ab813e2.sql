
-- Drop triggers first
DROP TRIGGER IF EXISTS update_session_unread_count_trigger ON public.live_chat_messages;
DROP TRIGGER IF EXISTS update_session_last_message_trigger ON public.live_chat_messages;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_session_unread_count();
DROP FUNCTION IF EXISTS public.update_session_last_message();
DROP FUNCTION IF EXISTS public.mark_session_as_read(uuid);
DROP FUNCTION IF EXISTS public.is_visitor_banned(uuid, text, text);
DROP FUNCTION IF EXISTS public.track_visitor_contact(uuid, text, text, text, text, text, jsonb);

-- Drop tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS public.live_chat_messages;
DROP TABLE IF EXISTS public.chat_sessions;
DROP TABLE IF EXISTS public.banned_visitors;
DROP TABLE IF EXISTS public.visitor_contacts;

-- Remove live chat columns from widgets table
ALTER TABLE public.widgets 
DROP COLUMN IF EXISTS live_chat_enabled,
DROP COLUMN IF EXISTS live_chat_agent_name,
DROP COLUMN IF EXISTS live_chat_greeting,
DROP COLUMN IF EXISTS live_chat_color,
DROP COLUMN IF EXISTS live_chat_auto_open,
DROP COLUMN IF EXISTS live_chat_offline_message,
DROP COLUMN IF EXISTS live_chat_require_email,
DROP COLUMN IF EXISTS live_chat_require_name,
DROP COLUMN IF EXISTS live_chat_require_phone,
DROP COLUMN IF EXISTS live_chat_custom_fields,
DROP COLUMN IF EXISTS live_chat_button_text;
