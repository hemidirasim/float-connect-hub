import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Hesabınız təsdiqlənir...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the URL hash parameters
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        // Check if this is an email confirmation
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        if (accessToken && refreshToken && type === 'signup') {
          // Set the session manually
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setStatus('error');
            setMessage('Hesab təsdiqlənməsi zamanı xəta baş verdi.');
            return;
          }
          
          setStatus('success');
          setMessage('Hesabınız uğurla təsdiqləndi!');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Handle other auth callbacks
          const { error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session:', error);
            setStatus('error');
            setMessage('Giriş zamanı xəta baş verdi.');
            return;
          }
          
          setStatus('success');
          setMessage('Uğurla daxil oldunuz!');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        setStatus('error');
        setMessage('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Hesab təsdiqlənir...'}
            {status === 'success' && 'Təsdiqləndi!'}
            {status === 'error' && 'Xəta!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
          )}
          
          {status === 'success' && (
            <CheckCircle className="h-16 w-16 text-green-600" />
          )}
          
          {status === 'error' && (
            <XCircle className="h-16 w-16 text-red-600" />
          )}
          
          <p className="text-center text-gray-700">{message}</p>
          
          {status === 'error' && (
            <Button onClick={() => navigate('/')}>
              Ana səhifəyə qayıt
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;