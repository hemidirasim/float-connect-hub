
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  const { user, loading, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin role:', error);
          toast({
            title: "Xəta",
            description: "Admin icazəsi yoxlanılarkən xəta baş verdi",
            variant: "destructive",
          });
        }

        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin role:', error);
      } finally {
        setChecking(false);
      }
    };

    checkAdminRole();
  }, [user, toast]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
          <p className="text-gray-300 mb-8">Bu səhifəyə daxil olmaq üçün admin hesabı ilə giriş etməlisiniz.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-400 mb-4">Giriş Qadağandır</h1>
          <p className="text-gray-300">Bu səhifəyə yalnız admin istifadəçiləri daxil ola bilər.</p>
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
                <p className="text-sm text-gray-300">{user.email}</p>
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
