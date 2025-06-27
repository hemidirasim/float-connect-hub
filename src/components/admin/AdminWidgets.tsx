
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Trash2, Eye, User, ExternalLink } from 'lucide-react';
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Widget {
  id: string;
  name: string;
  website_url: string;
  is_active: boolean;
  video_enabled: boolean;
  total_views: number;
  created_at: string;
  user_id: string;
  user_email?: string;
}

export const AdminWidgets = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  useEffect(() => {
    if (adminUser) {
      fetchWidgets();
    }
  }, [adminUser]);

  const fetchWidgets = async () => {
    if (!adminUser) return;

    try {
      const { data: widgetsData, error: widgetsError } = await supabase
        .from('widgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (widgetsError) {
        console.error('Widgets error:', widgetsError);
      } else {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email');

        const widgetsWithEmails = widgetsData?.map(widget => ({
          ...widget,
          user_email: profiles?.find(p => p.id === widget.user_id)?.email || 'Bilinmir'
        })) || [];

        setWidgets(widgetsWithEmails);
      }
    } catch (error) {
      console.error('Error fetching widgets:', error);
      toast({
        title: "Xəta",
        description: "Widget-lər yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWidgetStatus = async (widgetId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('widgets')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', widgetId);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: `Widget ${!currentStatus ? 'aktivləşdirildi' : 'deaktivləşdirildi'}`,
      });

      fetchWidgets();
    } catch (error) {
      console.error('Error toggling widget status:', error);
      toast({
        title: "Xəta",
        description: "Widget statusu dəyişdirilərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const deleteWidget = async (widgetId: string, widgetName: string) => {
    if (!confirm(`"${widgetName}" widget-ini silmək istədiyinizdən əminsiniz? Bu əməliyyat geri alına bilməz.`)) {
      return;
    }

    try {
      await supabase
        .from('widget_views')
        .delete()
        .eq('widget_id', widgetId);

      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', widgetId);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Widget silindi",
      });

      fetchWidgets();
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast({
        title: "Xəta",
        description: "Widget silinərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white text-xl">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Settings className="w-6 h-6 text-red-400" />
            </div>
            Widget-lər
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-75 mx-auto"></div>
            <p className="mt-4 text-gray-400 font-medium">Widget-lər yüklənir...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!adminUser) {
    return (
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <p className="text-xl text-gray-300 font-medium">Admin girişi tələb olunur</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white text-xl">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Settings className="w-6 h-6 text-red-400" />
          </div>
          Widget-lər ({widgets.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
                <TableHead className="text-gray-300 font-semibold">Ad</TableHead>
                <TableHead className="text-gray-300 font-semibold">Sayt</TableHead>
                <TableHead className="text-gray-300 font-semibold">İstifadəçi</TableHead>
                <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                <TableHead className="text-gray-300 font-semibold">Video</TableHead>
                <TableHead className="text-gray-300 font-semibold">Baxışlar</TableHead>
                <TableHead className="text-gray-300 font-semibold">Yaradılma Tarixi</TableHead>
                <TableHead className="text-gray-300 font-semibold">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {widgets.map((widget) => (
                <TableRow key={widget.id} className="border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <TableCell className="font-medium text-white">{widget.name}</TableCell>
                  <TableCell>
                    <a 
                      href={widget.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 max-w-xs truncate"
                    >
                      {widget.website_url}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell className="text-gray-300">{widget.user_email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={widget.is_active}
                        onCheckedChange={() => toggleWidgetStatus(widget.id, widget.is_active)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <Badge variant={widget.is_active ? 'default' : 'secondary'} className="font-medium">
                        {widget.is_active ? 'Aktiv' : 'Deaktiv'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={widget.video_enabled ? 'default' : 'outline'} className="font-medium">
                      {widget.video_enabled ? 'Var' : 'Yox'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-purple-400 font-semibold">{widget.total_views}</TableCell>
                  <TableCell className="text-gray-300">{new Date(widget.created_at).toLocaleDateString('az-AZ')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(widget.website_url, '_blank')}
                        className="border-gray-600 text-white hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteWidget(widget.id, widget.name)}
                        className="hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
