
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
  const [message, setMessage] = useState('Hesabınız təsdiqlənir...');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Validate password on change
  useEffect(() => {
    if (newPassword) {
      const errors: string[] = [];
      
      if (newPassword.length < 8) {
        errors.push("Şifrə ən azı 8 simvol olmalıdır");
      }
      
      if (!/[A-Z]/.test(newPassword)) {
        errors.push("Ən azı bir böyük hərf olmalıdır");
      }
      
      if (!/[a-z]/.test(newPassword)) {
        errors.push("Ən azı bir kiçik hərf olmalıdır");
      }
      
      if (!/[0-9]/.test(newPassword)) {
        errors.push("Ən azı bir rəqəm olmalıdır");
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
        errors.push("Ən azı bir xüsusi simvol olmalıdır (!@#$%^&*...)");
      }
      
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [newPassword]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback handling started");
        console.log("Current URL:", window.location.href);
        console.log("Location search:", location.search);
        console.log("Location hash:", window.location.hash);
        
        // Parse both URL search params and hash params for complete coverage
        const searchParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check both sources for parameters
        const code = searchParams.get('code') || hashParams.get('code');
        const type = searchParams.get('type') || hashParams.get('type');
        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
        
        console.log("Parsed parameters:", { 
          code: !!code, 
          type, 
          error, 
          errorDescription,
          fromSearch: !!searchParams.get('type'),
          fromHash: !!hashParams.get('type')
        });
        
        // Handle error parameters first
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setMessage(`Giriş xətası: ${errorDescription || error}`);
          return;
        }
        
        // ABSOLUTE PRIORITY: Check for recovery type IMMEDIATELY
        if (type === 'recovery') {
          console.log("🔐 PASSWORD RECOVERY DETECTED - Blocking all other flows");
          setStatus('reset_password');
          setMessage('Yeni şifrənizi təyin edin');
          
          // Handle code exchange for recovery if present
          if (code) {
            try {
              console.log("Exchanging recovery code...");
              const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
              if (exchangeError) {
                console.error('Recovery code exchange error:', exchangeError);
                setStatus('error');
                setMessage('Şifrə sıfırlama linkinin müddəti bitib və ya etibarsızdır.');
                return;
              }
              console.log('✅ Recovery code exchanged - staying on password reset form');
            } catch (error) {
              console.error('Recovery code exchange exception:', error);
              setStatus('error');
              setMessage('Şifrə sıfırlama zamanı xəta baş verdi.');
              return;
            }
          }
          
          // CRITICAL: Return here to prevent ANY other processing
          console.log("🛑 STOPPING HERE - Recovery flow complete");
          return;
        }
        
        // Only proceed with other flows if NOT recovery
        console.log("Not a recovery flow - proceeding with normal auth callback");
        
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
                setMessage('Hesabınız uğurla təsdiqləndi!');
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
                    setMessage('Hesabınız uğurla təsdiqləndi!');
                    setTimeout(() => {
                      navigate('/dashboard');
                    }, 1000);
                  } else {
                    setStatus('success');
                    setMessage('Email təsdiqləndi! Zəhmət olmasa daxil olun.');
                    setTimeout(() => {
                      navigate('/');
                    }, 3000);
                  }
                }, 1000);
                return;
              } else if (exchangeError.message.includes('expired')) {
                setStatus('error');
                setMessage('Email təsdiq linkinin müddəti bitib. Zəhmət olmasa yenidən qeydiyyatdan keçin.');
              } else {
                setStatus('error');
                setMessage('Giriş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
              }
              return;
            }
            
            if (data?.session) {
              console.log('Session created successfully');
              setStatus('success');
              setMessage('Hesabınız uğurla təsdiqləndi!');
              
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              setStatus('error');
              setMessage('Sessiya yaradıla bilmədi. Zəhmət olmasa yenidən daxil olun.');
            }
          } catch (error) {
            console.error('Unexpected error during code exchange:', error);
            
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('User authenticated despite error');
              setStatus('success');
              setMessage('Hesabınız uğurla təsdiqləndi!');
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
            } else {
              setStatus('error');
              setMessage('Gözlənilməz xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
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
          setMessage('Sessiya yoxlanıla bilmədi. Zəhmət olmasa yenidən daxil olun.');
          return;
        }
        
        if (session) {
          console.log('Existing session found');
          setStatus('success');
          setMessage('Artıq daxil olmusunuz!');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          console.log('No session found');
          setStatus('success');
          setMessage('Email təsdiqləndi! Zəhmət olmasa daxil olun.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
        
      } catch (error) {
        console.error('General error in auth callback:', error);
        
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setStatus('success');
            setMessage('Hesabınız uğurla təsdiqləndi!');
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
          }
        } catch {
          setStatus('error');
          setMessage('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
        }
      }
    };

    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate, location.search]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Bütün sahələri doldurun");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Şifrələr uyğun gəlmir");
      return;
    }
    
    if (passwordErrors.length > 0) {
      toast.error("Şifrə tələblərə uyğun deyil");
      return;
    }
    
    setPasswordUpdating(true);
    
    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        console.error('Error updating password:', error);
        toast.error("Şifrə yeniləmə xətası: " + error.message);
        setStatus('error');
        setMessage('Şifrə yeniləmə zamanı xəta baş verdi: ' + error.message);
      } else {
        toast.success("Şifrəniz uğurla yeniləndi!");
        setStatus('success');
        setMessage('Şifrəniz uğurla yeniləndi!');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error("Şifrə yeniləmə zamanı xəta baş verdi");
      setStatus('error');
      setMessage('Şifrə yeniləmə zamanı xəta baş verdi: ' + error.message);
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Hesab təsdiqlənir...'}
            {status === 'success' && 'Təsdiqləndi!'}
            {status === 'error' && 'Xəta!'}
            {status === 'reset_password' && 'Şifrəni Yenilə'}
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
                Zəhmət olmasa yeni şifrənizi daxil edin
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Yeni şifrə</Label>
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
                <Label htmlFor="confirm-password">Şifrəni təsdiqlə</Label>
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
                    <div className="text-sm font-medium mb-1">Şifrə tələbləri:</div>
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
                    Şifrələr uyğun gəlmir
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={passwordUpdating || passwordErrors.length > 0 || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {passwordUpdating ? 'Yenilənir...' : 'Şifrəni Yenilə'}
              </Button>
            </form>
          )}
          
          {status === 'error' && (
            <div className="space-y-3 w-full">
              <Button onClick={() => navigate('/')} className="w-full">
                Ana səhifəyə qayıt
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Yenidən qeydiyyatdan keç
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
