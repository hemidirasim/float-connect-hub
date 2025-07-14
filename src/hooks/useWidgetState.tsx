
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
    tooltipPosition: 'top',
    greetingMessage: '',
    video: null,
    videoUrl: undefined,
    videoType: 'upload',
    videoLink: undefined,
    useVideoPreview: false,
    videoHeight: 200,
    videoAlignment: 'center',
    videoObjectFit: 'cover',
    customIcon: 'message',
    customIconUrl: '',
    buttonSize: 60,
    previewVideoHeight: 120,
    templateId: 'default'
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
        console.log('Loading widget for edit:', data);
        setEditingWidget(data);
        setWebsiteName(data.name || '');
        setWebsiteUrl(data.website_url || '');
        setChannels(data.channels || []);
        setFormData({
          buttonColor: data.button_color || '#25d366',
          position: data.position || 'right',
          tooltip: data.tooltip || 'Contact us!',
          tooltipDisplay: data.tooltip_display || 'hover',
          tooltipPosition: data.tooltip_position || 'top',
          greetingMessage: data.greeting_message || '',
          video: null,
          videoUrl: data.video_url || undefined,
          videoType: data.video_url && (data.video_url.includes('youtube.com') || data.video_url.includes('vimeo.com') || data.video_url.includes('dailymotion.com')) ? 'link' : 'upload',
          videoLink: data.video_url && (data.video_url.includes('youtube.com') || data.video_url.includes('vimeo.com') || data.video_url.includes('dailymotion.com')) ? data.video_url : undefined,
          useVideoPreview: data.video_enabled || false,
          videoHeight: data.video_height || 200,
          videoAlignment: data.video_alignment || 'center',
          videoObjectFit: data.video_object_fit || 'cover',
          customIcon: data.custom_icon_url ? 'custom' : 'message',
          customIconUrl: data.custom_icon_url || '',
          buttonSize: data.button_size || 60,
          previewVideoHeight: data.preview_video_height || 120,
          templateId: data.template_id || 'default'
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
      tooltipPosition: 'top',
      greetingMessage: '',
      video: null,
      videoUrl: undefined,
      videoType: 'upload',
      videoLink: undefined,
      useVideoPreview: false,
      videoHeight: 200,
      videoAlignment: 'center',
      videoObjectFit: 'cover',
      customIcon: 'message',
      customIconUrl: '',
      buttonSize: 60,
      previewVideoHeight: 120,
      templateId: 'default'
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
