/*
  # Fix ticket_replies table and policies

  1. Changes
     - Safely creates ticket_replies table if it doesn't exist
     - Adds RLS policies if they don't exist
     - Creates performance indexes if they don't exist
  
  2. Security
     - Enables row level security
     - Adds policies for users to view and create replies for their own tickets
*/

-- Create ticket_replies table if it doesn't exist
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

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY';
EXCEPTION
  WHEN others THEN
    NULL;
END $$;

-- Create policies for ticket replies if they don't exist
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
END $$;

DO $$ 
BEGIN
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

-- Create indexes for better performance if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes 
    WHERE tablename = 'ticket_replies' 
    AND indexname = 'idx_ticket_replies_ticket_id'
  ) THEN
    CREATE INDEX idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_indexes 
    WHERE tablename = 'ticket_replies' 
    AND indexname = 'idx_ticket_replies_created_at'
  ) THEN
    CREATE INDEX idx_ticket_replies_created_at ON public.ticket_replies(created_at);
  END IF;
END $$;