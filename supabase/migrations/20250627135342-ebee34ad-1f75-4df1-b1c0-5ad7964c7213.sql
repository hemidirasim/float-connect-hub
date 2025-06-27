
-- Mövcud profiles cədvəlindən bir istifadəçini admin kimi təyin edək
-- Əvvəlcə mövcud istifadəçiləri yoxlayaq
DO $$
DECLARE
    first_user_id uuid;
BEGIN
    -- İlk istifadəçinin ID-sini tapaq
    SELECT id INTO first_user_id FROM public.profiles LIMIT 1;
    
    -- Əgər istifadəçi varsa, onu admin kimi təyin edək
    IF first_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (first_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'User % has been made admin', first_user_id;
    ELSE
        RAISE NOTICE 'No users found in profiles table';
    END IF;
END $$;

-- Admin authentication-u user_roles cədvəli ilə yoxlamaq üçün function yaradaq
CREATE OR REPLACE FUNCTION public.verify_user_admin_login(p_email TEXT, p_password TEXT)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  is_admin BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auth.users cədvəlindən istifadəçini yoxlayaq və admin rolunu yoxlayaq
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    CASE WHEN ur.role = 'admin' THEN true ELSE false END as is_admin
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id AND ur.role = 'admin'
  WHERE p.email = p_email 
    AND ur.role = 'admin';
END;
$$;

-- Bütün admin policy-ləri user_roles ilə işləsin
DROP POLICY IF EXISTS "Admins can manage all blogs" ON public.blogs;
CREATE POLICY "Admins can manage all blogs"
  ON public.blogs
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all tickets" ON public.support_tickets;
CREATE POLICY "Admins can update all tickets"
  ON public.support_tickets
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all replies" ON public.ticket_replies;
CREATE POLICY "Admins can view all replies"
  ON public.ticket_replies
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can create replies" ON public.ticket_replies;
CREATE POLICY "Admins can create replies"
  ON public.ticket_replies
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all widgets" ON public.widgets;
CREATE POLICY "Admins can view all widgets"
  ON public.widgets
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all widgets" ON public.widgets;
CREATE POLICY "Admins can update all widgets"
  ON public.widgets
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete all widgets" ON public.widgets;
CREATE POLICY "Admins can delete all widgets"
  ON public.widgets
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
