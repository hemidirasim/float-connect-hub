-- Create banned_visitors table for managing banned users
CREATE TABLE public.banned_visitors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_id uuid NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
  visitor_email text,
  visitor_ip text,
  visitor_name text,
  ban_reason text,
  banned_by uuid REFERENCES auth.users(id),
  banned_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create visitor_contacts table for collecting all visitor information
CREATE TABLE public.visitor_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_id uuid NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  visitor_email text,
  visitor_phone text,
  visitor_ip text,
  user_agent text,
  first_contact_at timestamp with time zone NOT NULL DEFAULT now(),
  last_contact_at timestamp with time zone NOT NULL DEFAULT now(),
  total_sessions integer DEFAULT 1,
  custom_fields jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Ensure unique visitor per widget based on email or ip
  UNIQUE(widget_id, visitor_email),
  UNIQUE(widget_id, visitor_ip)
);

-- Enable RLS for banned_visitors
ALTER TABLE public.banned_visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for banned_visitors
CREATE POLICY "Widget owners can view their banned visitors" 
ON public.banned_visitors 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM widgets 
  WHERE widgets.id = banned_visitors.widget_id 
  AND widgets.user_id = auth.uid()
));

CREATE POLICY "Widget owners can manage their banned visitors" 
ON public.banned_visitors 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM widgets 
  WHERE widgets.id = banned_visitors.widget_id 
  AND widgets.user_id = auth.uid()
));

-- Enable RLS for visitor_contacts
ALTER TABLE public.visitor_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for visitor_contacts
CREATE POLICY "Widget owners can view their visitor contacts" 
ON public.visitor_contacts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM widgets 
  WHERE widgets.id = visitor_contacts.widget_id 
  AND widgets.user_id = auth.uid()
));

CREATE POLICY "Anyone can create visitor contacts" 
ON public.visitor_contacts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Widget owners can update their visitor contacts" 
ON public.visitor_contacts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM widgets 
  WHERE widgets.id = visitor_contacts.widget_id 
  AND widgets.user_id = auth.uid()
));

-- Add is_banned column to chat_sessions
ALTER TABLE public.chat_sessions 
ADD COLUMN is_banned boolean DEFAULT false;

-- Create function to check if visitor is banned
CREATE OR REPLACE FUNCTION public.is_visitor_banned(
  p_widget_id uuid,
  p_visitor_email text DEFAULT NULL,
  p_visitor_ip text DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.banned_visitors 
    WHERE widget_id = p_widget_id 
    AND is_active = true
    AND (
      (p_visitor_email IS NOT NULL AND visitor_email = p_visitor_email) OR
      (p_visitor_ip IS NOT NULL AND visitor_ip = p_visitor_ip)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track visitor contacts
CREATE OR REPLACE FUNCTION public.track_visitor_contact(
  p_widget_id uuid,
  p_visitor_name text,
  p_visitor_email text DEFAULT NULL,
  p_visitor_phone text DEFAULT NULL,
  p_visitor_ip text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_custom_fields jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  contact_id uuid;
BEGIN
  -- Try to update existing contact
  UPDATE public.visitor_contacts 
  SET 
    last_contact_at = now(),
    total_sessions = total_sessions + 1,
    visitor_phone = COALESCE(p_visitor_phone, visitor_phone),
    custom_fields = p_custom_fields,
    updated_at = now()
  WHERE widget_id = p_widget_id 
  AND (
    (p_visitor_email IS NOT NULL AND visitor_email = p_visitor_email) OR
    (p_visitor_ip IS NOT NULL AND visitor_ip = p_visitor_ip)
  )
  RETURNING id INTO contact_id;
  
  -- If no existing contact, create new one
  IF contact_id IS NULL THEN
    INSERT INTO public.visitor_contacts (
      widget_id, visitor_name, visitor_email, visitor_phone, 
      visitor_ip, user_agent, custom_fields
    ) VALUES (
      p_widget_id, p_visitor_name, p_visitor_email, p_visitor_phone,
      p_visitor_ip, p_user_agent, p_custom_fields
    ) RETURNING id INTO contact_id;
  END IF;
  
  RETURN contact_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_banned_visitors_widget_id ON public.banned_visitors(widget_id);
CREATE INDEX idx_banned_visitors_email ON public.banned_visitors(visitor_email);
CREATE INDEX idx_banned_visitors_ip ON public.banned_visitors(visitor_ip);
CREATE INDEX idx_visitor_contacts_widget_id ON public.visitor_contacts(widget_id);
CREATE INDEX idx_visitor_contacts_email ON public.visitor_contacts(visitor_email);
CREATE INDEX idx_visitor_contacts_ip ON public.visitor_contacts(visitor_ip);