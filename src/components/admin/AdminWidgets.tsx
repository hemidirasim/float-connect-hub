
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Trash2, Eye, User } from 'lucide-react';
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
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="w-5 h-5" />
            Widget-lər
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Yüklənir...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!adminUser) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-400">Admin girişi tələb olunur</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="w-5 h-5" />
          Widget-lər ({widgets.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Ad</TableHead>
                <TableHead className="text-gray-300">Sayt</TableHead>
                <TableHead className="text-gray-300">İstifadəçi</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Video</TableHead>
                <TableHead className="text-gray-300">Baxışlar</TableHead>
                <TableHead className="text-gray-300">Yaradılma Tarixi</TableHead>
                <TableHead className="text-gray-300">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {widgets.map((widget) => (
                <TableRow key={widget.id} className="border-gray-700 hover:bg-gray-750">
                  <TableCell className="font-medium text-white">{widget.name}</TableCell>
                  <TableCell>
                    <a 
                      href={widget.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {widget.website_url}
                    </a>
                  </TableCell>
                  <TableCell className="text-gray-300">{widget.user_email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={widget.is_active}
                        onCheckedChange={() => toggleWidgetStatus(widget.id, widget.is_active)}
                      />
                      <Badge variant={widget.is_active ? 'default' : 'secondary'}>
                        {widget.is_active ? 'Aktiv' : 'Deaktiv'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={widget.video_enabled ? 'default' : 'outline'}>
                      {widget.video_enabled ? 'Var' : 'Yox'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{widget.total_views}</TableCell>
                  <TableCell className="text-gray-300">{new Date(widget.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(widget.website_url, '_blank')}
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteWidget(widget.id, widget.name)}
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
