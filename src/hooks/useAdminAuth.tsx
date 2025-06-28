
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let mounted = true;

    const checkAdminRole = async (user: User) => {
      try {
        console.log('Checking admin role for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (!mounted) return;

        if (error) {
          console.error('Admin role check error:', error);
          setAdminUser(null);
          setLoading(false);
          return;
        }

        if (data) {
          console.log('User has admin role');
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle();

          if (!mounted) return;

          setAdminUser({
            user_id: user.id,
            email: user.email || '',
            full_name: profile?.full_name || user.email?.split('@')[0] || '',
            is_admin: true
          });
        } else {
          console.log('User does not have admin role');
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        if (mounted) {
          setAdminUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          setAdminUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Existing session found for:', session.user.email);
          setUser(session.user);
          await checkAdminRole(session.user);
        } else {
          console.log('No existing session');
          setUser(null);
          setAdminUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setAdminUser(null);
          setLoading(false);
        }
      }
    };

    // İlk olaraq mövcud sessiyonu yoxla
    initializeAuth();

    // Auth state dinləyicisini qur
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null);
          setAdminUser(null);
          setLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(true);
          setUser(session.user);
          await checkAdminRole(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      setLoading(true);
      
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
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      setAdminUser(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out exception:', error);
    } finally {
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
