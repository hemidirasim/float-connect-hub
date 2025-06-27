
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, MessageSquare, Settings, Shield, LogOut } from 'lucide-react';
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminBlogs } from "@/components/admin/AdminBlogs";
import { AdminPayments } from "@/components/admin/AdminPayments";
import { AdminTickets } from "@/components/admin/AdminTickets";
import { AdminWidgets } from "@/components/admin/AdminWidgets";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { adminUser, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Çıxış",
      description: "Admin paneldən çıxış edildi",
    });
    navigate('/admin/login');
  };

  useEffect(() => {
    console.log('AdminDashboard - loading:', loading, 'adminUser:', adminUser);
    
    // Yalnız loading false olduqda və adminUser yoxdursa redirect et
    if (!loading && !adminUser) {
      console.log('Redirecting to admin login');
      navigate('/admin/login');
    }
  }, [adminUser, loading, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 border-opacity-75 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300 font-medium">Admin paneli yüklənir...</p>
        </div>
      </div>
    );
  }

  // Admin user yoxdursa
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <p className="text-xl text-gray-300 font-medium">Admin girişi tələb olunur</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Admin Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">Sistem İdarəetmə Paneli</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-200">{adminUser.full_name || adminUser.email}</p>
                <p className="text-xs text-red-400 font-medium">Administrator</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/70 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıxış
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1.5">
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-200 font-medium"
            >
              <Users className="w-4 h-4" />
              İstifadəçilər
            </TabsTrigger>
            <TabsTrigger 
              value="blogs" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-200 font-medium"
            >
              <FileText className="w-4 h-4" />
              Bloqlar
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-200 font-medium"
            >
              <CreditCard className="w-4 h-4" />
              Ödənişlər
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-200 font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Ticketlər
            </TabsTrigger>
            <TabsTrigger 
              value="widgets" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-200 font-medium"
            >
              <Settings className="w-4 h-4" />
              Widget-lər
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-8">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="blogs" className="mt-8">
            <AdminBlogs />
          </TabsContent>

          <TabsContent value="payments" className="mt-8">
            <AdminPayments />
          </TabsContent>

          <TabsContent value="tickets" className="mt-8">
            <AdminTickets />
          </TabsContent>

          <TabsContent value="widgets" className="mt-8">
            <AdminWidgets />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
