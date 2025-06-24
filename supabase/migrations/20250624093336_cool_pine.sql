/*
  # Fix ticket_replies table

  1. Changes
    - Check if ticket_replies table exists before creating
    - Add missing indexes and policies if needed
  2. Security
    - Ensure RLS is enabled
    - Add proper policies for users to view and create replies
*/

-- Only create the table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ticket_replies') THEN
    CREATE TABLE public.ticket_replies (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      message TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- Make sure RLS is enabled
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'ticket_replies' 
    AND policyname = 'Users can view replies for their tickets'
  ) THEN
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
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'ticket_replies' 
    AND policyname = 'Users can create replies for their tickets'
  ) THEN
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
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes 
    WHERE tablename = 'ticket_replies' 
    AND indexname = 'idx_ticket_replies_ticket_id'
  ) THEN
    CREATE INDEX idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM pg_indexes 
    WHERE tablename = 'ticket_replies' 
    AND indexname = 'idx_ticket_replies_created_at'
  ) THEN
    CREATE INDEX idx_ticket_replies_created_at ON public.ticket_replies(created_at);
  END IF;
END $$;