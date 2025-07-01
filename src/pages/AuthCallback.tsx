
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, KeyRound, AlertCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePassword } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'reset_password'>('loading');
  const [message, setMessage] = useState('Your account is being verified...');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Validate password on change
  useEffect(() => {
    if (newPassword) {
      const errors: string[] = [];
      
      if (newPassword.length < 8) {
        errors.push("Password must be at least 8 characters");
      }
      
      if (!/[A-Z]/.test(newPassword)) {
        errors.push("Must include at least one uppercase letter");
      }
      
      if (!/[a-z]/.test(newPassword)) {
        errors.push("Must include at least one lowercase letter");
      }
      
      if (!/[0-9]/.test(newPassword)) {
        errors.push("Must include at least one number");
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
        errors.push("Must include at least one special character (!@#$%^&*...)");
      }
      
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [newPassword]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("🚀 Auth callback handling started");
        console.log("📍 Current URL:", window.location.href);
        console.log("📍 Location search:", location.search);
        console.log("📍 Location hash:", window.location.hash);
        
        // Parse URL parameters from multiple sources
        const urlParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const fullUrl = new URL(window.location.href);
        
        // Get parameters from all possible sources
        const type = urlParams.get('type') || hashParams.get('type') || fullUrl.searchParams.get('type');
        const token = urlParams.get('token') || hashParams.get('token') || fullUrl.searchParams.get('token');
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        
        console.log("🔍 All parameters found:", {
          type,
          token: token ? 'present' : 'missing',
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          error,
          errorDescription,
          fullSearchParams: fullUrl.search,
          hashSearchParams: window.location.hash
        });
        
        // Handle error parameters first
        if (error) {
          console.error('❌ OAuth error detected:', error, errorDescription);
          setStatus('error');
          setMessage(`Login error: ${errorDescription || error}`);
          return;
        }
        
        // Check if this is a password recovery
        if (type === 'recovery') {
          console.log("🔐 Password recovery flow detected");
          
          // Try to exchange the token for a session
          if (token) {
            try {
              console.log("🔐 Attempting to verify recovery token...");
              
              // First try to verify the token
              const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'recovery'
              });
              
              console.log("🔐 Token verification result:", { 
                success: !verifyError, 
                hasSession: !!verifyData?.session,
                error: verifyError?.message 
              });
              
              if (verifyError) {
                console.error('❌ Token verification failed:', verifyError);
                
                // If direct token verification fails, try session exchange
                try {
                  console.log("🔐 Trying session exchange...");
                  const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(token);
                  
                  if (sessionError) {
                    console.error('❌ Session exchange failed:', sessionError);
                    setStatus('error');
                    setMessage('Password reset link has expired or is invalid. Please request a new one.');
                    return;
                  }
                  
                  if (sessionData.session) {
                    console.log('✅ Session established via exchange');
                    setStatus('reset_password');
                    setMessage('Set your new password');
                    return;
                  }
                } catch (exchangeError) {
                  console.error('❌ Session exchange exception:', exchangeError);
                  setStatus('error');
                  setMessage('Password reset link has expired or is invalid. Please request a new one.');
                  return;
                }
              }
              
              if (verifyData?.session) {
                console.log('✅ Recovery session established successfully');
                setStatus('reset_password');
                setMessage('Set your new password');
                return;
              }
            } catch (error) {
              console.error('❌ Exception during token verification:', error);
              setStatus('error');
              setMessage('Password reset link has expired or is invalid. Please request a new one.');
              return;
            }
          }
          
          // If we have access and refresh tokens, try to set session directly
          if (accessToken && refreshToken) {
            try {
              console.log("🔐 Setting session with provided tokens...");
              const { data, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (sessionError) {
                console.error('❌ Session set error:', sessionError);
                setStatus('error');
                setMessage('Password reset link has expired or is invalid. Please request a new one.');
                return;
              }
              
              if (data.session) {
                console.log('✅ Recovery session established with tokens');
                setStatus('reset_password');
                setMessage('Set your new password');
                return;
              }
            } catch (error) {
              console.error('❌ Exception setting session:', error);
              setStatus('error');
              setMessage('Password reset link has expired or is invalid. Please request a new one.');
              return;
            }
          }
          
          // If we reach here, no valid recovery method worked
          console.log("❌ No valid recovery method worked");
          setStatus('error');
          setMessage('Password reset link has expired or is invalid. Please request a new one.');
          return;
        }
        
        // Handle normal auth flow
        console.log("Checking for existing session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setStatus('error');
          setMessage('Session could not be verified. Please log in again.');
          return;
        }
        
        if (session) {
          console.log('Existing session found');
          setStatus('success');
          setMessage('You are already logged in!');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          console.log('No session found');
          setStatus('success');
          setMessage('Email verified! Please log in.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
        
      } catch (error) {
        console.error('❌ General error in auth callback:', error);
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate, location.search]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Fill in all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (passwordErrors.length > 0) {
      toast.error("Password does not meet requirements");
      return;
    }
    
    setPasswordUpdating(true);
    
    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error("Password update error: " + error.message);
        setStatus('error');
        setMessage('An error occurred during password update: ' + error.message);
      } else {
        toast.success("Your password has been successfully updated!");
        setStatus('success');
        setMessage('Your password has been successfully updated!');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error("An error occurred during password update");
      setStatus('error');
      setMessage('An error occurred during password update: ' + error.message);
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Account verification in progress...'}
            {status === 'success' && 'Verified!'}
            {status === 'error' && 'Error!'}
            {status === 'reset_password' && 'Reset Password'}
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
          
          {status === 'reset_password' && (
            <KeyRound className="h-16 w-16 text-blue-600" />
          )}
          
          {status !== 'reset_password' && (
            <p className="text-center text-gray-700">{message}</p>
          )}
          
          {status === 'reset_password' && (
            <form onSubmit={handlePasswordUpdate} className="w-full space-y-4">
              <p className="text-center text-gray-700 mb-4">
                Please enter your new password
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {passwordErrors.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="text-sm font-medium mb-1">Password requirements:</div>
                    <ul className="text-xs list-disc pl-5 space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Passwords do not match
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={passwordUpdating || passwordErrors.length > 0 || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {passwordUpdating ? 'Updating...' : 'Reset Password'}
              </Button>
            </form>
          )}
          
          {status === 'error' && (
            <div className="space-y-3 w-full">
              <Button onClick={() => navigate('/')} className="w-full">
                Return to homepage
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Request new reset link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
