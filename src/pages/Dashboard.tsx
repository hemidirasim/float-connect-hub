import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Eye, Settings, CreditCard, MessageSquare, BarChart3, Coins, Globe, Smartphone, Monitor, Code, Home, LogOut, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SupportTickets } from "@/components/SupportTickets";
import { ProfileSettings } from "@/components/ProfileSettings";
import { BillingSection } from "@/components/BillingSection";
import { useNavigate } from "react-router-dom";

interface Widget {
  id: string;
  name: string;
  website_url: string;
  button_color: string;
  position: string;
  tooltip: string;
  video_enabled: boolean;
  video_url: string;
  button_style: string;
  custom_icon_url: string;
  show_on_mobile: boolean;
  show_on_desktop: boolean;
  channels: any[];
  total_views: number;
  is_active: boolean;
  created_at: string;
}

interface UserCredits {
  balance: number;
  total_spent: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [userCredits, setUserCredits] = useState<UserCredits>({ balance: 0, total_spent: 0 });
  const [loadingWidgets, setLoadingWidgets] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWidgets();
      fetchUserCredits();
    }
  }, [user]);

  const fetchWidgets = async () => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWidgets(data || []);
    } catch (error) {
      console.error('Error fetching widgets:', error);
      toast.error('Error loading widgets');
    } finally {
      setLoadingWidgets(false);
    }
  };

  const fetchUserCredits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      // Only log and show error for non-PGRST116 errors
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching credits:', error);
        toast.error('Error loading credits');
      }
      // For PGRST116 (no rows found), silently use default values
      setUserCredits(data || { balance: 100, total_spent: 0 });
    } catch (error) {
      // Only log and show error for non-PGRST116 errors
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching credits:', error);
        toast.error('Error loading credits');
      }
      // For PGRST116 (no rows found), silently use default values
      setUserCredits({ balance: 100, total_spent: 0 });
    }
  };

  const handleToggleActive = async (widgetId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('widgets')
        .update({ is_active: !currentStatus })
        .eq('id', widgetId);

      if (error) throw error;
      toast.success(`Widget ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchWidgets();
    } catch (error) {
      console.error('Error updating widget status:', error);
      toast.error('Error updating widget status');
    }
  };

  const handleDeleteWidget = async (widgetId: string, widgetName: string) => {
    if (!confirm(`Are you sure you want to delete "${widgetName}" widget?`)) return;

    try {
      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', widgetId);

      if (error) throw error;
      toast.success('Widget deleted');
      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast.error('Error deleting widget');
    }
  };

  const handleCustomize = (widgetId: string) => {
    // Store widget ID in localStorage to edit on main page
    localStorage.setItem('editWidgetId', widgetId);
    // Navigate to main page with a hash to scroll to the widget form
    navigate('/#widget-form');
  };

  const generateWidgetCode = (widget: Widget) => {
    let scriptCode = `<script src="https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/${widget.id}"></script>`;
    return scriptCode;
  };

  const copyCode = (widget: Widget) => {
    const code = generateWidgetCode(widget);
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

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

  if (loading || loadingWidgets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please sign in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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
              <span>{user?.email}</span>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Balance</p>
                  <p className="text-2xl font-bold text-green-600">{userCredits.balance}</p>
                  <p className="text-xs text-gray-500">credits</p>
                </div>
                <Coins className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Websites</p>
                  <p className="text-2xl font-bold text-blue-600">{widgets.length}</p>
                  <p className="text-xs text-gray-500">active: {widgets.filter(w => w.is_active).length}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {widgets.reduce((sum, w) => sum + (w.total_views || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500">all websites</p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Spent</p>
                  <p className="text-2xl font-bold text-orange-600">{userCredits.total_spent}</p>
                  <p className="text-xs text-gray-500">credits</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="widgets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="widgets">My Websites</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Websites</h2>
              <Button onClick={() => navigate('/')}>
                <Globe className="w-4 h-4 mr-2" />
                Add New Website
              </Button>
            </div>

            {widgets.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
                  <p className="text-gray-600 mb-4">Add your first website and create a widget</p>
                  <Button onClick={() => navigate('/')}>
                    <Globe className="w-4 h-4 mr-2" />
                    Add First Website
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets.map((widget) => (
                  <Card key={widget.id} className={`relative ${widget.is_active ? 'border-green-200' : 'border-gray-200'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{widget.website_url}</CardTitle>
                            <p className="text-xs text-gray-500">
                              {widget.is_active ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={widget.is_active}
                          onCheckedChange={() => handleToggleActive(widget.id, widget.is_active)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Views:</span>
                          <span className="font-medium">{widget.total_views || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Channels:</span>
                          <span className="font-medium">{widget.channels?.length || 0}</span>
                        </div>
                        {widget.video_url && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Video:</span>
                            <span className="font-medium text-green-600">✓</span>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCustomize(widget.id)}
                            className="flex-1"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Customize
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyCode(widget)}
                          >
                            <Code className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteWidget(widget.id, widget.website_url)}
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="billing">
            <BillingSection userCredits={userCredits} onCreditsUpdate={fetchUserCredits} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="support">
            <SupportTickets />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;