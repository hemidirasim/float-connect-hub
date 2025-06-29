
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, LogOut, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardHeaderProps {
  userEmail: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userEmail }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Manage your widgets and track your statistics</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{userEmail}</span>
        </div>
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button 
          onClick={handleSignOut}
          variant="outline"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
