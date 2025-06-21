import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Channel, FormData } from "@/components/FloatingWidgetBuilder/types";

export const useWidgetState = (user: any) => {
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelType, setSelectedChannelType] = useState('');
  const [channelValue, setChannelValue] = useState('');
  const [editingWidget, setEditingWidget] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    buttonColor: '#25d366',
    position: 'right',
    tooltip: 'Contact us!',
    tooltipDisplay: 'hover',
    video: null,
    useVideoPreview: false,
    videoHeight: 200,
    videoAlignment: 'center',
    customIcon: null,
    customIconUrl: ''
  });

  // Check for editing widget on load
  useEffect(() => {
    const editWidgetId = localStorage.getItem('editWidgetId');
    if (editWidgetId && user) {
      fetchWidgetForEdit(editWidgetId);
      localStorage.removeItem('editWidgetId');
    }
  }, [user]);

  const fetchWidgetForEdit = async (widgetId: string) => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('id', widgetId)
        .single();

      if (error) throw error;

      if (data) {
        setEditingWidget(data);
        setWebsiteName(data.name || '');
        setWebsiteUrl(data.website_url || '');
        setChannels(data.channels || []);
        setFormData({
          buttonColor: data.button_color || '#25d366',
          position: data.position || 'right',
          tooltip: data.tooltip || 'Contact us!',
          tooltipDisplay: data.tooltip_display || 'hover',
          video: null,
          useVideoPreview: data.video_enabled || false,
          videoHeight: data.video_height || 200,
          videoAlignment: data.video_alignment || 'center',
          customIcon: data.custom_icon_url ? 'custom' : null,
          customIconUrl: data.custom_icon_url || ''
        });

        // Scroll to widget form
        setTimeout(() => {
          const element = document.getElementById('widget-form');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching widget:', error);
      toast.error('Error loading widget for editing');
    }
  };

  const resetForm = () => {
    setEditingWidget(null);
    setWebsiteName('');
    setWebsiteUrl('');
    setChannels([]);
    setFormData({
      buttonColor: '#25d366',
      position: 'right',
      tooltip: 'Contact us!',
      tooltipDisplay: 'hover',
      video: null,
      useVideoPreview: false,
      videoHeight: 200,
      videoAlignment: 'center',
      customIcon: null,
      customIconUrl: ''
    });
  };

  return {
    websiteName,
    setWebsiteName,
    websiteUrl,
    setWebsiteUrl,
    channels,
    setChannels,
    selectedChannelType,
    setSelectedChannelType,
    channelValue,
    setChannelValue,
    editingWidget,
    setEditingWidget,
    generatedCode,
    setGeneratedCode,
    copied,
    setCopied,
    formData,
    setFormData,
    resetForm
  };
};
