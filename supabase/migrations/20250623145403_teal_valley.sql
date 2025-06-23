/*
  # Add unique email constraint to users table

  1. Changes
     - Add a unique constraint to the auth.users table for the email field
     - This ensures that duplicate email registrations are properly prevented at the database level
  
  2. Security
     - This migration enhances security by preventing duplicate accounts
*/

-- Add unique constraint to auth.users table for email field
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_email_unique' AND conrelid = 'auth.users'::regclass
  ) THEN
    ALTER TABLE auth.users ADD CONSTRAINT users_email_unique UNIQUE (email);
  END IF;
END $$;