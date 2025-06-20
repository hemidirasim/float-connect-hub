
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Settings, CreditCard, MessageSquare, BarChart3, Coins, Globe, Smartphone, Monitor } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WidgetCreator } from "@/components/WidgetCreator";
import { SupportTickets } from "@/components/SupportTickets";
import { ProfileSettings } from "@/components/ProfileSettings";
import { BillingSection } from "@/components/BillingSection";

interface Widget {
  id: string;
  name: string;
  website_url: string;
  button_color: string;
  position: string;
  tooltip: string;
  video_enabled: boolean;
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
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [userCredits, setUserCredits] = useState<UserCredits>({ balance: 0, total_spent: 0 });
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
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
      toast.error('Widget-ləri yükləməkdə xəta');
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
      setUserCredits(data || { balance: 100, total_spent: 0 });
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handleDeleteWidget = async (widgetId: string) => {
    if (!confirm('Bu widget-i silmək istədiyinizə əminsiniz?')) return;

    try {
      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', widgetId);

      if (error) throw error;
      toast.success('Widget silindi');
      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast.error('Widget silinməkdə xəta');
    }
  };

  const handleToggleWidget = async (widgetId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('widgets')
        .update({ is_active: !isActive })
        .eq('id', widgetId);

      if (error) throw error;
      toast.success(isActive ? 'Widget dayandırıldı' : 'Widget aktivləşdirildi');
      fetchWidgets();
    } catch (error) {
      console.error('Error toggling widget:', error);
      toast.error('Widget vəziyyəti dəyişdirilməkdə xəta');
    }
  };

  if (loading || loadingWidgets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Giriş tələb olunur</CardTitle>
            <CardDescription>Dashboard-a daxil olmaq üçün hesabınıza giriş edin</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Widget-lərinizi idarə edin və statistikalarınızı izləyin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Balans</p>
                  <p className="text-2xl font-bold text-green-600">{userCredits.balance}</p>
                  <p className="text-xs text-gray-500">kredit</p>
                </div>
                <Coins className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Widget sayı</p>
                  <p className="text-2xl font-bold text-blue-600">{widgets.length}</p>
                  <p className="text-xs text-gray-500">aktiv: {widgets.filter(w => w.is_active).length}</p>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ümumi görüntülənmə</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {widgets.reduce((sum, w) => sum + w.total_views, 0)}
                  </p>
                  <p className="text-xs text-gray-500">bütün widget-lər</p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Xərclənmiş</p>
                  <p className="text-2xl font-bold text-orange-600">{userCredits.total_spent}</p>
                  <p className="text-xs text-gray-500">kredit</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="widgets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="widgets">Widget-lər</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="support">Dəstək</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Widget-lərim</h2>
              <Dialog open={widgetModalOpen} onOpenChange={setWidgetModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingWidget(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Widget
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingWidget ? 'Widget-i redaktə et' : 'Yeni Widget yarat'}
                    </DialogTitle>
                  </DialogHeader>
                  <WidgetCreator
                    widget={editingWidget}
                    onSave={() => {
                      setWidgetModalOpen(false);
                      setEditingWidget(null);
                      fetchWidgets();
                    }}
                    onCancel={() => {
                      setWidgetModalOpen(false);
                      setEditingWidget(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {widgets.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Hələ widget-iniz yoxdur</h3>
                  <p className="text-gray-600 mb-4">İlk widget-inizi yaradın və saytınıza əlavə edin</p>
                  <Button onClick={() => setWidgetModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Widget-i yarat
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets.map((widget) => (
                  <Card key={widget.id} className={`relative ${widget.is_active ? 'border-green-200' : 'border-gray-200'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{widget.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={widget.is_active ? "default" : "secondary"}>
                            {widget.is_active ? 'Aktiv' : 'Passiv'}
                          </Badge>
                          {widget.video_enabled && (
                            <Badge variant="outline" className="text-purple-600">Video</Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{widget.website_url}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Görüntülənmə:</span>
                          <span className="font-medium">{widget.total_views}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Kanallar:</span>
                          <span className="font-medium">{widget.channels?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Cihazlar:</span>
                          <div className="flex gap-1">
                            {widget.show_on_mobile && <Smartphone className="w-4 h-4 text-blue-600" />}
                            {widget.show_on_desktop && <Monitor className="w-4 h-4 text-green-600" />}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingWidget(widget);
                              setWidgetModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleWidget(widget.id, widget.is_active)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteWidget(widget.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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
