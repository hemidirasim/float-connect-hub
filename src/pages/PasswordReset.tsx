
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PasswordReset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePassword } = useAuth();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
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
    const handlePasswordReset = async () => {
      try {
        console.log("🔐 Password reset page loaded");
        console.log("📍 Current URL:", window.location.href);
        
        // Parse URL parameters
        const urlParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const token = urlParams.get('token') || hashParams.get('token');
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        const errorCode = urlParams.get('error_code') || hashParams.get('error_code');
        
        console.log("🔍 Password reset parameters:", {
          token: token ? 'present' : 'missing',
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          error,
          errorCode,
          errorDescription
        });
        
        // Handle errors first
        if (error) {
          console.error('❌ Password reset error:', error, errorDescription);
          setStatus('error');
          return;
        }
        
        // Try to establish session for password reset
        if (accessToken && refreshToken) {
          try {
            console.log("🔐 Setting session with tokens...");
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (sessionError) {
              console.error('❌ Session error:', sessionError);
              setStatus('error');
              return;
            }
            
            if (data.session) {
              console.log('✅ Password reset session established');
              setStatus('ready');
              return;
            }
          } catch (error) {
            console.error('❌ Exception setting session:', error);
            setStatus('error');
            return;
          }
        }
        
        // If we have a token, try to verify it
        if (token) {
          try {
            console.log("🔐 Verifying recovery token...");
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'recovery'
            });
            
            if (verifyError) {
              console.error('❌ Token verification failed:', verifyError);
              setStatus('error');
              return;
            }
            
            if (data.session) {
              console.log('✅ Recovery session established');
              setStatus('ready');
              return;
            }
          } catch (error) {
            console.error('❌ Exception during token verification:', error);
            setStatus('error');
            return;
          }
        }
        
        // If no valid method worked
        console.log("❌ No valid recovery method found");
        setStatus('error');
        
      } catch (error) {
        console.error('❌ General error in password reset:', error);
        setStatus('error');
      }
    };

    handlePasswordReset();
  }, [location.search]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
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
      } else {
        toast.success("Your password has been successfully updated!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error("An error occurred during password update");
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/', { state: { showPasswordReset: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Loading...'}
            {status === 'ready' && 'Reset Your Password'}
            {status === 'error' && 'Link Expired'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              <p className="text-center text-gray-700">
                Verifying password reset link...
              </p>
            </>
          )}
          
          {status === 'ready' && (
            <>
              <KeyRound className="h-16 w-16 text-blue-600" />
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
                  {passwordUpdating ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </>
          )}
          
          {status === 'error' && (
            <div className="text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
              <p className="text-center text-gray-700">
                Password reset link has expired or is invalid. Please request a new one.
              </p>
              <div className="space-y-3 w-full">
                <Button onClick={() => navigate('/')} className="w-full">
                  Return to homepage
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleRequestNewLink} 
                  className="w-full"
                >
                  Request new reset link
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;
