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
        
        // Check for recovery token in URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        const type = queryParams.get('type');
        
        console.log("URL parameters:", { code, type });
        
        // Check for hash parameters (for older auth flows)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');
        
        console.log("Hash parameters:", { accessToken: !!accessToken, refreshToken: !!refreshToken, hashType });
        
        // First, check if this is a recovery flow
        if (type === 'recovery' || hashType === 'recovery') {
          console.log("Password recovery flow detected");
          setStatus('reset_password');
          setMessage('Yeni şifrənizi təyin edin');
          
          // If we have a code, exchange it for a session
          if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              console.error('Error exchanging recovery code for session:', error);
              setStatus('error');
              setMessage('Şifrə sıfırlama zamanı xəta baş verdi: ' + error.message);
              return;
            }
          }
          
          return;
        }
        
        // Handle code exchange for other flows
        if (code) {
          console.log("Exchanging code for session");
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            setStatus('error');
            setMessage('Giriş zamanı xəta baş verdi: ' + error.message);
            return;
          }
          
          setStatus('success');
          setMessage('Uğurla daxil oldunuz!');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          return;
        }
        
        // Handle hash-based auth (older flow)
        if (accessToken && refreshToken) {
          console.log("Setting session from hash parameters");
          // Set the session manually
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setStatus('error');
            setMessage('Hesab təsdiqlənməsi zamanı xəta baş verdi: ' + error.message);
            return;
          }
          
          setStatus('success');
          setMessage('Hesabınız uğurla təsdiqləndi!');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
          return;
        }
        
        // If we get here, try to get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setStatus('error');
          setMessage('Giriş zamanı xəta baş verdi: ' + error.message);
          return;
        }
        
        if (data.session) {
          setStatus('success');
          setMessage('Uğurla daxil oldunuz!');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Sessiya tapılmadı. Zəhmət olmasa yenidən daxil olun.');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        setStatus('error');
        setMessage('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

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
        
        // Redirect to dashboard after 2 seconds
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