
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  admin_id: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('admin_user');
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin);
        setAdminUser(admin);
      } catch (error) {
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Verify admin credentials
      const { data, error } = await supabase
        .rpc('verify_admin_login', {
          p_email: email,
          p_password: password
        });

      if (error) throw error;

      if (data && data.length > 0) {
        const admin = data[0];
        setAdminUser(admin);
        localStorage.setItem('admin_user', JSON.stringify(admin));
        
        // Update last login
        await supabase.rpc('update_admin_last_login', {
          p_admin_id: admin.admin_id
        });

        return { success: true };
      } else {
        return { error: 'Invalid email or password' };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
  };

  return {
    adminUser,
    loading,
    signIn,
    signOut
  };
};
