
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings, LogOut, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: any;
  loading: boolean;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, loading, onSignOut, onOpenAuth }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FloatWidget
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#support" className="text-gray-600 hover:text-blue-600 transition-colors">Support</a>
            {!loading && (
              user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    <Settings className="w-4 h-4 mr-1" />
                    Dashboard
                  </Button>
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={onSignOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Çıxış
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={onOpenAuth}>
                  <User className="w-4 h-4 mr-1" />
                  Giriş
                </Button>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
