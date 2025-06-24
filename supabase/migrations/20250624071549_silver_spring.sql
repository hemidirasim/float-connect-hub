/*
  # Clean up duplicate tables

  1. Changes
     - Drop duplicate tables that are no longer needed
     - These tables appear to be copies of the original tables with the same structure
  
  2. Affected Tables
     - blogs_duplicate
     - faqs_duplicate
     - payment_transactions_duplicate
     - profiles_duplicate
     - support_tickets_duplicate
     - user_credits_duplicate
     - widget_templates_duplicate
     - widget_views_duplicate
     - widgets_duplicate
*/

-- Drop duplicate tables if they exist
DROP TABLE IF EXISTS public.blogs_duplicate;
DROP TABLE IF EXISTS public.faqs_duplicate;
DROP TABLE IF EXISTS public.payment_transactions_duplicate;
DROP TABLE IF EXISTS public.profiles_duplicate;
DROP TABLE IF EXISTS public.support_tickets_duplicate;
DROP TABLE IF EXISTS public.user_credits_duplicate;
DROP TABLE IF EXISTS public.widget_templates_duplicate;
DROP TABLE IF EXISTS public.widget_views_duplicate;
DROP TABLE IF EXISTS public.widgets_duplicate;

-- Create a function to check email uniqueness without requiring direct table ownership
CREATE OR REPLACE FUNCTION public.check_email_uniqueness_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = NEW.email AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Email address already in use';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger on the profiles table to enforce email uniqueness
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'check_email_uniqueness_trigger'
  ) THEN
    CREATE TRIGGER check_email_uniqueness_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_email_uniqueness_on_signup();
  END IF;
END $$;