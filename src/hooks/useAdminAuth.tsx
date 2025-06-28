
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  user_id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Admin rolunu yoxlayan funksiya
  const checkAdminRole = useCallback(async (currentUser: User) => {
    try {
      console.log('Checking admin role for user:', currentUser.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Admin role check error:', error);
        return null;
      }

      if (data) {
        console.log('User has admin role');
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', currentUser.id)
          .maybeSingle();

        return {
          user_id: currentUser.id,
          email: currentUser.email || '',
          full_name: profile?.full_name || currentUser.email?.split('@')[0] || '',
          is_admin: true
        };
      } else {
        console.log('User does not have admin role');
        return null;
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('Initializing admin auth...');
        setLoading(true);
        
        // İlk olaraq mövcud sessiya yoxlanılır
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          setAdminUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Found existing session for:', session.user.email);
          setUser(session.user);
          
          // Admin rolunu yoxla
          const adminData = await checkAdminRole(session.user);
          if (isMounted) {
            setAdminUser(adminData);
            setLoading(false);
          }
        } else {
          console.log('No existing session found');
          setUser(null);
          setAdminUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setAdminUser(null);
          setLoading(false);
        }
      }
    };

    // Auth state listener qur
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (!isMounted) return;

          if (event === 'SIGNED_OUT' || !session?.user) {
            console.log('User signed out or no session');
            setUser(null);
            setAdminUser(null);
            setLoading(false);
            return;
          }

          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('User signed in or token refreshed');
            setLoading(true);
            setUser(session.user);
            
            try {
              const adminData = await checkAdminRole(session.user);
              if (isMounted) {
                setAdminUser(adminData);
                setLoading(false);
              }
            } catch (error) {
              console.error('Error in auth state change:', error);
              if (isMounted) {
                setAdminUser(null);
                setLoading(false);
              }
            }
          }
        }
      );
      
      authSubscription = subscription;
    };

    // İlk auth yoxlanması
    initializeAuth().then(() => {
      if (isMounted) {
        setupAuthListener();
      }
    });

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [checkAdminRole]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting admin sign in for:', email);
      setLoading(true);
      
      // Mövcud sessiyanı təmizlə
      await supabase.auth.signOut();
      
      // Kiçik gecikməni gözlə
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Sign in successful, checking admin role');
        
        // Admin rolunu yoxla
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!roleData) {
          console.log('User does not have admin role, signing out');
          await supabase.auth.signOut();
          setLoading(false);
          return { error: 'Bu hesabın admin girişi yoxdur' };
        }

        console.log('Admin role confirmed');
        // Loading false auth listener-dən edəcək
        return { success: true };
      }

      setLoading(false);
      return { error: 'Giriş uğursuz oldu' };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      setLoading(false);
      return { error: error.message };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out admin user');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // State-ləri təmizlə
      setAdminUser(null);
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.error('Sign out exception:', error);
      setLoading(false);
    }
  };

  return {
    adminUser,
    loading,
    signIn,
    signOut
  };
};
