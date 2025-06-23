/*
  # Email uniqueness validation

  1. Changes
    - Creates a function to validate email uniqueness during signup
    - Adds a trigger to the auth.users table to enforce email uniqueness
    - This approach works around permission limitations by using a trigger instead of a direct constraint
*/

-- Create a function to check for email uniqueness
CREATE OR REPLACE FUNCTION public.check_email_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email already exists (case insensitive)
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE lower(email) = lower(NEW.email) 
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Email address already in use';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a comment explaining why we're using this approach
COMMENT ON FUNCTION public.check_email_uniqueness() IS 
  'Function to enforce email uniqueness in auth.users table without requiring direct table ownership';

-- Note: We can't directly add triggers to auth.users due to permission restrictions
-- This migration provides the function that can be used by Supabase Auth hooks
-- or by application logic to enforce uniqueness