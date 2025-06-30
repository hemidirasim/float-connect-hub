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
        
        // Parse ALL possible URL parameters
        const fullUrl = window.location.href;
        console.log("🔗 Full URL being parsed:", fullUrl);
        
        // Multiple parsing approaches
        const urlObj = new URL(fullUrl);
        const searchParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Extract type from all sources
        const typeFromUrl = urlObj.searchParams.get('type');
        const typeFromSearch = searchParams.get('type');
        const typeFromHash = hashParams.get('type');
        const type = typeFromUrl || typeFromSearch || typeFromHash;
        
        // Extract other parameters
        const code = urlObj.searchParams.get('code') || searchParams.get('code') || hashParams.get('code');
        const token = urlObj.searchParams.get('token') || searchParams.get('token') || hashParams.get('token');
        const error = urlObj.searchParams.get('error') || searchParams.get('error') || hashParams.get('error');
        const errorDescription = urlObj.searchParams.get('error_description') || searchParams.get('error_description') || hashParams.get('error_description');
        
        console.log("🔍 Detailed parameter extraction:", {
          type,
          typeFromUrl,
          typeFromSearch, 
          typeFromHash,
          code: code ? 'present' : 'missing',
          token: token ? 'present' : 'missing',
          error,
          errorDescription,
          fullUrlParams: Object.fromEntries(urlObj.searchParams),
          searchParamsEntries: Object.fromEntries(searchParams),
          hashParamsEntries: Object.fromEntries(hashParams)
        });
        
        // Handle error parameters first
        if (error) {
          console.error('❌ OAuth error detected:', error, errorDescription);
          setStatus('error');
          setMessage(`Login error: ${errorDescription || error}`);
          return;
        }
        
        // CRITICAL CHECK: Is this a password recovery?
        console.log("🔐 Checking if this is a recovery flow...");
        console.log("🔐 Type parameter value:", type);
        console.log("🔐 Is type === 'recovery'?", type === 'recovery');
        
        if (type === 'recovery') {
          console.log("🔐✅ PASSWORD RECOVERY CONFIRMED - Setting up password reset form");
          setStatus('reset_password');
          setMessage('Set your new password');
          
          // If there's a code or token, try to exchange it
          const authCode = code || token;
          if (authCode) {
            try {
              console.log("🔐🔄 Attempting to exchange recovery code/token...");
              const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
              if (exchangeError) {
                console.error('❌ Recovery code exchange failed:', exchangeError);
                setStatus('error');
                setMessage('Password reset link has expired or is invalid.');
                return;
              }
              console.log('✅ Recovery code exchanged successfully');
            } catch (error) {
              console.error('❌ Exception during recovery code exchange:', error);
              setStatus('error');
              setMessage('An error occurred during password reset.');
              return;
            }
          }
          
          console.log("🔐🛑 RECOVERY FLOW SETUP COMPLETE - Staying on password reset page");
          return; // STOP HERE - don't process any other flows
        }
        
        console.log("ℹ️ Not a recovery flow, proceeding with normal authentication...");
        
        if (code) {
          console.log("Exchanging code for session (non-recovery)");
          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            
            if (exchangeError) {
              console.error('Code exchange error:', exchangeError);
              
              // Check if user is already authenticated despite the PKCE error
              const { data: { session } } = await supabase.auth.getSession();
              if (session) {
                console.log('User is already authenticated despite PKCE error');
                setStatus('success');
                setMessage('Your account has been successfully verified!');
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
                return;
              }
              
              // Handle specific PKCE errors more gracefully
              if (exchangeError.message.includes('code verifier') || 
                  exchangeError.message.includes('pkce')) {
                console.log('PKCE error detected, checking user status...');
                
                setTimeout(async () => {
                  const { data: { session } } = await supabase.auth.getSession();
                  if (session) {
                    console.log('User confirmed and session exists');
                    setStatus('success');
                    setMessage('Your account has been successfully verified!');
                    setTimeout(() => {
                      navigate('/dashboard');
                    }, 1000);
                  } else {
                    setStatus('success');
                    setMessage('Email verified! Please log in.');
                    setTimeout(() => {
                      navigate('/');
                    }, 3000);
                  }
                }, 1000);
                return;
              } else if (exchangeError.message.includes('expired')) {
                setStatus('error');
                setMessage('Email verification link has expired. Please register again.');
              } else {
                setStatus('error');
                setMessage('An error occurred during login. Please try again.');
              }
              return;
            }
            
            if (data?.session) {
              console.log('Session created successfully');
              setStatus('success');
              setMessage('Your account has been successfully verified!');
              
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              setStatus('error');
              setMessage('Session could not be created. Please log in again.');
            }
          } catch (error) {
            console.error('Unexpected error during code exchange:', error);
            
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('User authenticated despite error');
              setStatus('success');
              setMessage('Your account has been successfully verified!');
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              setStatus('error');
              setMessage('An unexpected error occurred. Please try again.');
            }
          }
          return;
        }
        
        // If no code parameter, check current session
        console.log("No code parameter, checking current session");
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
        
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setStatus('success');
            setMessage('Your account has been successfully verified!');
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('An error occurred. Please try again.');
          }
        } catch {
          setStatus('error');
          setMessage('An error occurred. Please try again.');
        }
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
                Register again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;