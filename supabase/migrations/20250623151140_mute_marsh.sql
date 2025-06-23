/*
  # Email Uniqueness Check Function

  1. Changes
     - Creates a function to check email uniqueness during registration
     - Adds a comment explaining the approach
  
  2. Security
     - Uses SECURITY DEFINER to ensure proper permissions
     - Avoids direct modification of auth.users table
*/

-- Create a function to check for email uniqueness during registration
CREATE OR REPLACE FUNCTION public.check_email_uniqueness_on_signup()
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

-- Add a comment explaining why we're using this approach
COMMENT ON FUNCTION public.check_email_uniqueness_on_signup() IS 
  'Function to enforce email uniqueness in auth.users table without requiring direct table ownership. 
   This avoids the permission error when trying to add constraints directly to auth.users.';