
-- Create ticket_replies table for support ticket conversations
CREATE TABLE public.ticket_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for ticket replies
CREATE POLICY "Users can view replies for their tickets" 
  ON public.ticket_replies 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_replies.ticket_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create replies for their tickets" 
  ON public.ticket_replies 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE id = ticket_replies.ticket_id 
      AND user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
CREATE INDEX idx_ticket_replies_created_at ON public.ticket_replies(created_at);
