import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
}

interface Session {
  access_token: string;
  user: User;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const { user } = await response.json();
          setUser(user);
          setSession({ access_token: token, user });
          console.log('Auth state changed:', 'SIGNED_IN');
        } else {
          localStorage.removeItem('auth_token');
          setUser(null);
          setSession(null);
          console.log('Auth state changed:', 'SIGNED_OUT');
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
        setUser(null);
        setSession(null);
        console.log('Auth state changed:', 'SIGNED_OUT');
      }
    } else {
      console.log('Auth state changed:', 'INITIAL_SESSION');
      console.log('Got existing session:', 'no');
    }
    setLoading(false);
  };

  const signUp = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password,
          full_name: email.split('@')[0]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data };
      }
      
      // Store token and update state
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      setSession(data.session);
      
      return { data, error: null };
    } catch (error) {
      console.error('Error during signup:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data };
      }
      
      // Store token and update state
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      setSession(data.session);
      
      return { data, error: null };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      localStorage.removeItem('auth_token');
      setUser(null);
      setSession(null);
      
      return { error: null };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    // Password reset functionality can be implemented later
    console.log('Password reset not yet implemented');
    return { error: { message: 'Password reset not yet implemented' } };
  };

  const updatePassword = async (newPassword: string) => {
    // Password update functionality can be implemented later
    console.log('Password update not yet implemented');
    return { error: { message: 'Password update not yet implemented' } };
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