
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from 'lucide-react';
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminWidgets } from "@/components/admin/AdminWidgets";
import { AdminBlogs } from "@/components/admin/AdminBlogs";
import { BlogGenerator } from "@/components/admin/BlogGenerator";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        setAdminLoading(true);
        console.log('Checking admin status for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error("Error fetching admin status:", error);
          toast.error("Admin statusu yoxlanılarkən xəta baş verdi.");
          setIsAdmin(false);
        } else if (data) {
          console.log('User has admin role');
          setIsAdmin(true);
        } else {
          console.log('User does not have admin role');
          toast.error("Bu səhifəyə giriş icazəniz yoxdur.");
          setIsAdmin(false);
          navigate('/');
        }
        setAdminLoading(false);
      }
    };

    if (user && !loading) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  if (loading || adminLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/admin/login');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Giriş Qadağandır</h2>
          <p className="text-gray-600">Bu səhifəyə giriş icazəniz yoxdur.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <nav>
            <button onClick={() => supabase.auth.signOut()} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white">
                Website Analytics
              </CardTitle>
              <Settings className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">71,897</div>
              <p className="text-xs text-muted-foreground text-gray-400">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white">
                New Subscribers
              </CardTitle>
              <Settings className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+2350</div>
              <p className="text-xs text-muted-foreground text-gray-400">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-white">
                Active Now
              </CardTitle>
              <Settings className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+12,234</div>
              <p className="text-xs text-muted-foreground text-gray-400">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          
          <BlogGenerator />
          
        </div>

        <Tabs defaultValue={activeTab} className="mt-8">
          <TabsList>
            <TabsTrigger value="users" onClick={() => setActiveTab("users")}>Users</TabsTrigger>
            <TabsTrigger value="widgets" onClick={() => setActiveTab("widgets")}>Widgets</TabsTrigger>
            <TabsTrigger value="blogs" onClick={() => setActiveTab("blogs")}>Blogs</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="widgets">
            <AdminWidgets />
          </TabsContent>
          <TabsContent value="blogs">
            <AdminBlogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
