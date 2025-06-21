
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, User } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";

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
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hiclient
            </h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</Link>
            <Link to="/blogs" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Create Widget</Link>
            {!loading && (
              user ? (
                <Link 
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <Button variant="outline" size="sm" onClick={onOpenAuth}>
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
