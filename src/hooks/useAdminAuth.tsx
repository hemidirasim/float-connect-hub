
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
          .single();

        if (!mounted) return;

        if (error && error.code !== 'PGRST116') {
          console.error('Admin role check error:', error);
          setAdminUser(null);
          return;
        }

        if (data) {
          console.log('User has admin role');
          // İstifadəçi admin roluna malikdir
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

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
      }
    };

    // Auth state dinləyicisini quraq
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          await checkAdminRole(session.user);
        } else {
          setUser(null);
          setAdminUser(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Mövcud sessiyonu yoxlayaq
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('Existing session found for:', session.user.email);
          setUser(session.user);
          await checkAdminRole(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      if (data.user) {
        console.log('Sign in successful, checking admin role');
        
        // Admin rolunu yoxlayaq
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (!roleData) {
          console.log('User does not have admin role, signing out');
          await supabase.auth.signOut();
          return { error: 'Bu hesabın admin girişi yoxdur' };
        }

        console.log('Admin role confirmed');
        return { success: true };
      }

      return { error: 'Giriş uğursuz oldu' };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return { error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    setUser(null);
  };

  return {
    adminUser,
    loading,
    signIn,
    signOut
  };
};
