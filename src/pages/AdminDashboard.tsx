
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AdminBlogs } from "@/components/admin/AdminBlogs";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminSupport } from "@/components/admin/AdminSupport";
import { AdminSEO } from "@/components/admin/AdminSEO";
import { AdminWidgets } from "@/components/admin/AdminWidgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, User, Settings, MessageSquare, Search, Widget } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('blogs');
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Uğurlu",
        description: "Uğurla çıxış edildi",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Xəta",
        description: "Çıxış zamanı xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <CardTitle className="text-white font-bold text-xl">
            Admin Paneli
          </CardTitle>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-300">
                {user.email}
              </span>
            )}
            <Button onClick={handleSignOut} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              Çıxış
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            variant={activeTab === 'blogs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('blogs')}
            className={activeTab === 'blogs' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-600 text-white hover:bg-gray-700'}
          >
            <FileText className="w-4 h-4 mr-2" />
            Bloqlar
          </Button>
          <Button
            variant={activeTab === 'widgets' ? 'default' : 'outline'}
            onClick={() => setActiveTab('widgets')}
            className={activeTab === 'widgets' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-white hover:bg-gray-700'}
          >
            <Widget className="w-4 h-4 mr-2" />
            Widget-lər
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-white hover:bg-gray-700'}
          >
            <User className="w-4 h-4 mr-2" />
            İstifadəçilər
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('settings')}
            className={activeTab === 'settings' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-gray-600 text-white hover:bg-gray-700'}
          >
            <Settings className="w-4 h-4 mr-2" />
            Parametrlər
          </Button>
          <Button
            variant={activeTab === 'support' ? 'default' : 'outline'}
            onClick={() => setActiveTab('support')}
            className={activeTab === 'support' ? 'bg-green-600 hover:bg-green-700' : 'border-gray-600 text-white hover:bg-gray-700'}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Dəstək
          </Button>
          <Button
            variant={activeTab === 'seo' ? 'default' : 'outline'}
            onClick={() => setActiveTab('seo')}
            className={activeTab === 'seo' ? 'bg-teal-600 hover:bg-teal-700' : 'border-gray-600 text-white hover:bg-gray-700'}
          >
            <Search className="w-4 h-4 mr-2" />
            SEO
          </Button>
        </div>

        {activeTab === 'blogs' && <AdminBlogs />}
        {activeTab === 'widgets' && <AdminWidgets />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'support' && <AdminSupport />}
        {activeTab === 'seo' && <AdminSEO />}
      </div>
    </div>
  );
};

export default AdminDashboard;
