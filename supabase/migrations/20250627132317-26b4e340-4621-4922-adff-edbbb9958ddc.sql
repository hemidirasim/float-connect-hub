
-- Create admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view their own data
CREATE POLICY "Admins can view their own data"
  ON public.admins
  FOR SELECT
  USING (auth.uid()::text = id::text OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create policy for admins to update their own data
CREATE POLICY "Admins can update their own data"
  ON public.admins
  FOR UPDATE
  USING (auth.uid()::text = id::text OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Function to verify admin login
CREATE OR REPLACE FUNCTION public.verify_admin_login(p_email TEXT, p_password TEXT)
RETURNS TABLE(
  admin_id UUID,
  email TEXT,
  full_name TEXT,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.email,
    a.full_name,
    a.is_active
  FROM public.admins a
  WHERE a.email = p_email 
    AND a.password_hash = crypt(p_password, a.password_hash)
    AND a.is_active = true;
END;
$$;

-- Function to create admin (for internal use)
CREATE OR REPLACE FUNCTION public.create_admin(p_email TEXT, p_password TEXT, p_full_name TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_admin_id UUID;
BEGIN
  INSERT INTO public.admins (email, password_hash, full_name)
  VALUES (p_email, crypt(p_password, gen_salt('bf')), p_full_name)
  RETURNING id INTO new_admin_id;
  
  RETURN new_admin_id;
END;
$$;

-- Create demo admin account
SELECT public.create_admin('admin@hiclient.co', 'AdminPass2024!', 'System Administrator');

-- Update admin last login function
CREATE OR REPLACE FUNCTION public.update_admin_last_login(p_admin_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.admins 
  SET last_login = now(), updated_at = now()
  WHERE id = p_admin_id;
END;
$$;
