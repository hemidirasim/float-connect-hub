
-- Create payment_transactions table to track Paddle payments
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  paddle_transaction_id TEXT NOT NULL UNIQUE,
  paddle_subscription_id TEXT,
  product_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  credits_purchased INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paddle_checkout_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.payment_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Service role can insert transactions (for webhooks)
CREATE POLICY "Service role can insert transactions" 
  ON public.payment_transactions 
  FOR INSERT 
  WITH CHECK (true);

-- Service role can update transactions (for webhooks)
CREATE POLICY "Service role can update transactions" 
  ON public.payment_transactions 
  FOR UPDATE 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_paddle_transaction_id ON public.payment_transactions(paddle_transaction_id);
