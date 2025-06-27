import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Validate password on change
  useEffect(() => {
    if (!isLogin && password) {
      const errors: string[] = [];
      
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push("Must contain at least one uppercase letter");
      }
      
      if (!/[a-z]/.test(password)) {
        errors.push("Must contain at least one lowercase letter");
      }
      
      if (!/[0-9]/.test(password)) {
        errors.push("Must contain at least one number");
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Must contain at least one special character (!@#$%^&*...)");
      }
      
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  }, [password, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || (!isForgotPassword && !password)) {
      toast.error("Email and password are required");
      return;
    }

    // Additional validation for registration
    if (!isLogin && !isForgotPassword) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      if (passwordErrors.length > 0) {
        toast.error("Password does not meet requirements");
        return;
      }
    }

    setLoading(true);
    try {
      if (isForgotPassword) {
        // Handle password reset
        const { error } = await resetPassword(email);
        if (error) {
          toast.error("Password reset error: " + error.message);
        } else {
          setResetEmailSent(true);
          toast.success("Password reset link sent!", {
            description: "Please check your email."
          });
        }
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Incorrect email or password");
          } else {
            toast.error("Login error: " + error.message);
          }
        } else {
          toast.success("Successfully logged in!");
          onOpenChange(false);
          setEmail('');
          setPassword('');
        }
      } else {
        const { data, error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error("This email is already registered. Please log in.");
          } else {
            toast.error("Registration error: " + error.message);
          }
        } else {
          setEmailSent(true);
          toast.success("Registration successfully completed!", {
            description: "A confirmation email has been sent. Please check your email."
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred");
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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordErrors([]);
    setEmailSent(false);
    setResetEmailSent(false);
    setIsForgotPassword(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isForgotPassword ? (
              <>
                <Lock className="w-5 h-5 text-blue-600" />
                Reset Password
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-blue-600" />
                {isLogin ? 'Log In' : 'Sign Up'}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {emailSent ? (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <p className="font-medium">Confirmation email sent!</p>
                <p className="mt-1">Please check the email sent to <strong>{email}</strong> and verify your account.</p>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-600">Didn’t receive the email?</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setEmailSent(false);
                  setIsLogin(true);
                }}
              >
                Return to Login
              </Button>
            </div>
          </div>
        ) : resetEmailSent ? (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <p className="font-medium">Password reset link sent!</p>
                <p className="mt-1">Please check the email sent to <strong>{email}</strong> and reset your password.</p>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-600">Didn’t receive the email?</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setResetEmailSent(false);
                  setIsForgotPassword(false);
                  setIsLogin(true);
                }}
              >
                Return to Login
              </Button>
            </div>
          </div>
        ) : isForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-2 -ml-2 text-gray-600"
                onClick={() => setIsForgotPassword(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Go Back
              </Button>
              
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address to receive a password reset link.
              </p>
              
              <Label htmlFor="reset-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Password Reset Link'}
            </Button>
          </form>
        ) : (
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
                Password
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
                    Confirm Password
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
                      <div className="text-sm font-medium mb-1">Password requirements:</div>
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
                      Passwords do not match
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
            </Button>
            
            <div className="flex justify-between text-sm">
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-blue-600 hover:underline"
                >
                  Forgot your password?
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setPassword('');
                  setConfirmPassword('');
                  setPasswordErrors([]);
                }}
                className={`text-blue-600 hover:underline ${isLogin ? 'ml-auto' : ''}`}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};