import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Get the current site URL for redirects
const getSiteUrl = () => {
  // For production, use the actual domain
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return window.location.origin;
  }
  
  // For local development, use the Netlify URL or a fallback
  return 'https://monumental-bonbon-88b744.netlify.app';
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session with proper error handling
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got existing session:', session ? 'yes' : 'no');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.log('Error getting session:', error);
      // Handle invalid/expired refresh token gracefully
      setSession(null);
      setUser(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      // Enable email confirmation by setting emailRedirectTo
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Set redirect URL for email confirmation
          emailRedirectTo: `${getSiteUrl()}/auth/callback`,
          data: {
            full_name: email.split('@')[0] // Default name from email
          }
        }
      });
      
      // Check if user already exists
      if (error && error.message.includes('already registered')) {
        return { error };
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error during signup:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getSiteUrl()}/auth/callback`,
      });
      return { error };
    } catch (error) {
      console.error('Error during password reset:', error);
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      return { error };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};