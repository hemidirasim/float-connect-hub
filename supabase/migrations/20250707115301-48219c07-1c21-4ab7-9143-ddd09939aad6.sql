-- Add live chat pre-form settings to widgets table
ALTER TABLE public.widgets 
ADD COLUMN live_chat_require_email boolean DEFAULT false,
ADD COLUMN live_chat_require_name boolean DEFAULT true,
ADD COLUMN live_chat_require_phone boolean DEFAULT false,
ADD COLUMN live_chat_custom_fields text DEFAULT '';

-- Create index for better performance
CREATE INDEX idx_widgets_live_chat_enabled ON public.widgets(live_chat_enabled) WHERE live_chat_enabled = true;