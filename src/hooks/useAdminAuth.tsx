
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
    // Auth state dinləyicisini quraq
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await checkAdminRole(session.user);
        } else {
          setUser(null);
          setAdminUser(null);
        }
        setLoading(false);
      }
    );

    // Mövcud sessiyonu yoxlayaq
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkAdminRole(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Admin role check error:', error);
        setAdminUser(null);
        return;
      }

      if (data) {
        // İstifadəçi admin roluna malikdir
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        setAdminUser({
          user_id: user.id,
          email: user.email || '',
          full_name: profile?.full_name || user.email?.split('@')[0] || '',
          is_admin: true
        });
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setAdminUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        await checkAdminRole(data.user);
        
        // Admin rolunu yoxlayaq
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .single();

        if (!roleData) {
          await supabase.auth.signOut();
          return { error: 'Bu hesabın admin girişi yoxdur' };
        }

        return { success: true };
      }

      return { error: 'Giriş uğursuz oldu' };
    } catch (error: any) {
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
