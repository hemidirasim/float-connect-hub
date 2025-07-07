
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminBlogs } from "@/components/admin/AdminBlogs";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminSupport } from "@/components/admin/AdminSupport";
import { AdminSEO } from "@/components/admin/AdminSEO";
import { AdminWidgets } from "@/components/admin/AdminWidgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { FileText, User, Settings, MessageSquare, Search, Package, Shield, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('blogs');
  const { adminUser, loading, signOut } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Uğurlu",
        description: "Uğurla çıxış edildi",
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Xəta",
        description: "Çıxış zamanı xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <p className="text-gray-300">Admin girişi yoxlanılır...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Shield className="w-12 h-12 text-red-500" />
              <p className="text-gray-300 text-center">Admin girişi tələb olunur</p>
              <Button 
                onClick={() => navigate('/admin/login')}
                className="bg-red-600 hover:bg-red-700"
              >
                Admin Giriş
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <CardTitle className="text-white font-bold text-xl">
            Admin Paneli
          </CardTitle>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              {adminUser.email}
            </span>
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
            <Package className="w-4 h-4 mr-2" />
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
