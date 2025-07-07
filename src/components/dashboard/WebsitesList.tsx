
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, Settings, Code, Trash2, MessageCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface WebsitesListProps {
  widgets: Widget[];
  onRefresh: () => void;
}

export const WebsitesList: React.FC<WebsitesListProps> = ({ widgets, onRefresh }) => {
  const navigate = useNavigate();

  const handleToggleActive = async (widgetId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('widgets')
        .update({ is_active: !currentStatus })
        .eq('id', widgetId);

      if (error) throw error;
      toast.success(`Widget ${!currentStatus ? 'activated' : 'deactivated'}`);
      onRefresh();
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
      onRefresh();
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast.error('Error deleting widget');
    }
  };

  const handleCustomize = (widgetId: string) => {
    localStorage.setItem('editWidgetId', widgetId);
    navigate('/#widget-form');
  };

  const copyCode = (widget: Widget) => {
    const code = `<script src="https://ttzioshkresaqmsodhfb.supabase.co/functions/v1/widget-js/${widget.id}"></script>`;
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  const handleLiveChat = (widgetId: string) => {
    navigate(`/live-chat/${widgetId}`);
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
};
