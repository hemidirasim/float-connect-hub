
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
    
    if (!loading && !adminUser) {
      console.log('Redirecting to admin login');
      navigate('/admin/login');
    }
  }, [adminUser, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-300">Admin girişi tələb olunur</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Admin Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">Sistem İdarəetmə</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">{adminUser.full_name || adminUser.email}</p>
                <p className="text-xs text-red-400">Administrator</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıxış
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border border-gray-700">
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
            >
              <Users className="w-4 h-4" />
              İstifadəçilər
            </TabsTrigger>
            <TabsTrigger 
              value="blogs" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
            >
              <FileText className="w-4 h-4" />
              Bloqlar
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
            >
              <CreditCard className="w-4 h-4" />
              Ödənişlər
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
            >
              <MessageSquare className="w-4 h-4" />
              Ticketlər
            </TabsTrigger>
            <TabsTrigger 
              value="widgets" 
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
            >
              <Settings className="w-4 h-4" />
              Widget-lər
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="blogs">
            <AdminBlogs />
          </TabsContent>

          <TabsContent value="payments">
            <AdminPayments />
          </TabsContent>

          <TabsContent value="tickets">
            <AdminTickets />
          </TabsContent>

          <TabsContent value="widgets">
            <AdminWidgets />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
