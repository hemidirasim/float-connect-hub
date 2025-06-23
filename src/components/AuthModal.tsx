import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Validate password on change
  useEffect(() => {
    if (!isLogin && password) {
      const errors: string[] = [];
      
      if (password.length < 8) {
        errors.push("Şifrə ən azı 8 simvol olmalıdır");
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push("Ən azı bir böyük hərf olmalıdır");
      }
      
      if (!/[a-z]/.test(password)) {
        errors.push("Ən azı bir kiçik hərf olmalıdır");
      }
      
      if (!/[0-9]/.test(password)) {
        errors.push("Ən azı bir rəqəm olmalıdır");
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Ən azı bir xüsusi simvol olmalıdır (!@#$%^&*...)");
      }
      
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Email və şifrə tələb olunur");
      return;
    }

    // Additional validation for registration
    if (!isLogin) {
      if (password !== confirmPassword) {
        toast.error("Şifrələr uyğun gəlmir");
        return;
      }
      
      if (passwordErrors.length > 0) {
        toast.error("Şifrə tələblərə uyğun deyil");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Yanlış email və ya şifrə");
          } else {
            toast.error("Giriş xətası: " + error.message);
          }
        } else {
          toast.success("Uğurla daxil oldunuz!");
          onOpenChange(false);
          setEmail('');
          setPassword('');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error("Bu email artıq qeydiyyatdan keçib. Zəhmət olmasa daxil olun.");
          } else {
            toast.error("Qeydiyyat xətası: " + error.message);
          }
        } else {
          toast.success("Qeydiyyat uğurla tamamlandı!", {
            description: "Hesabınız yaradıldı və artıq daxil ola bilərsiniz."
          });
          // Switch to login mode after successful registration
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (error) {
      toast.error("Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            {isLogin ? 'Daxil ol' : 'Qeydiyyatdan keç'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Şifrə
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Şifrəni təsdiqlə
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {passwordErrors.length > 0 && (
                <Alert variant="destructive">
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
              
              {password && confirmPassword && password !== confirmPassword && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Şifrələr uyğun gəlmir
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Zəhmət olmasa gözləyin...' : (isLogin ? 'Daxil ol' : 'Qeydiyyatdan keç')}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
                setPasswordErrors([]);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin ? "Hesabınız yoxdur? Qeydiyyatdan keçin" : "Artıq hesabınız var? Daxil olun"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};