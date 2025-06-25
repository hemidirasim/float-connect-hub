/*
  # Payment System Migration

  1. New Tables
    - `transactions` - Stores payment transaction details
  
  2. Security
    - Enable RLS on transactions table
    - Add policies for users to view their own transactions
    - Add policy for service role to insert transactions
*/

-- Create transactions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
    CREATE TABLE public.transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id),
      transaction_id TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'completed',
      product_id TEXT,
      credits_added INTEGER NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'transactions' 
    AND policyname = 'Users can view their own transactions'
  ) THEN
    CREATE POLICY "Users can view their own transactions" 
      ON public.transactions 
      FOR SELECT 
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'transactions' 
    AND policyname = 'Service role can insert transactions'
  ) THEN
    CREATE POLICY "Service role can insert transactions" 
      ON public.transactions 
      FOR INSERT 
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON public.transactions(transaction_id);

-- Create function to update user credits after transaction
CREATE OR REPLACE FUNCTION public.process_transaction_credits()
RETURNS TRIGGER AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current user balance
  SELECT balance INTO current_balance FROM public.user_credits 
  WHERE user_id = NEW.user_id;
  
  -- If user has no credits record, create one
  IF current_balance IS NULL THEN
    INSERT INTO public.user_credits (user_id, balance, total_spent)
    VALUES (NEW.user_id, 100 + NEW.credits_added, 0);
  ELSE
    -- Update existing balance
    UPDATE public.user_credits
    SET balance = balance + NEW.credits_added,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update credits
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_user_credits_after_transaction'
  ) THEN
    CREATE TRIGGER update_user_credits_after_transaction
    AFTER INSERT ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.process_transaction_credits();
  END IF;
EXCEPTION
  WHEN others THEN
    NULL;
END $$;