
-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update existing tables to allow admin access
-- Blogs table policies
CREATE POLICY "Admins can manage all blogs"
  ON public.blogs
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Support tickets policies
CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all tickets"
  ON public.support_tickets
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Ticket replies policies
CREATE POLICY "Admins can view all replies"
  ON public.ticket_replies
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create replies"
  ON public.ticket_replies
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Widgets policies
CREATE POLICY "Admins can view all widgets"
  ON public.widgets
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all widgets"
  ON public.widgets
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete all widgets"
  ON public.widgets
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Transactions policies
CREATE POLICY "Admins can view all transactions"
  ON public.transactions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Payment transactions policies
CREATE POLICY "Admins can view all payment transactions"
  ON public.payment_transactions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- User credits policies
CREATE POLICY "Admins can view all user credits"
  ON public.user_credits
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert a default admin user (you'll need to update this with your actual user ID)
-- This is just an example - you should replace the user_id with your actual admin user ID
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-admin-user-id-here', 'admin');
