
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
    greetingMessage: 'Hello! How can we help you today?',
    video: null,
    videoUrl: undefined,
    useVideoPreview: false,
    videoHeight: 200,
    videoAlignment: 'center',
    videoObjectFit: 'cover',
    customIcon: 'message',
    customIconUrl: '',
    buttonSize: 60,
    previewVideoHeight: 120,
    templateId: 'default',
    // Live chat fields
    liveChatEnabled: false,
    liveChatAgentName: 'Support Agent',
    liveChatGreeting: 'Hello! How can we help you today?',
    liveChatColor: '#4f46e5',
    liveChatAutoOpen: false,
    liveChatOfflineMessage: 'We are currently offline. Please leave a message and we will get back to you.',
    // Pre-chat form fields
    liveChatRequireEmail: false,
    liveChatRequireName: true,
    liveChatRequirePhone: false,
    liveChatCustomFields: [],
    // Pre-chat form labels and placeholders
    liveChatNameLabel: 'Name',
    liveChatNamePlaceholder: 'Your name',
    liveChatEmailLabel: 'Email',
    liveChatEmailPlaceholder: 'your@email.com',
    liveChatPhoneLabel: 'Phone',
    liveChatPhonePlaceholder: '+1 (555) 123-4567',
    liveChatButtonText: 'Start Live Chat'
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
          greetingMessage: data.greeting_message || 'Hello! How can we help you today?',
          video: null,
          videoUrl: data.video_url || undefined,
          useVideoPreview: data.video_enabled || false,
          videoHeight: data.video_height || 200,
          videoAlignment: data.video_alignment || 'center',
          videoObjectFit: data.video_object_fit || 'cover',
          customIcon: data.custom_icon_url ? 'custom' : 'message',
          customIconUrl: data.custom_icon_url || '',
          buttonSize: data.button_size || 60,
          previewVideoHeight: data.preview_video_height || 120,
          templateId: data.template_id || 'default',
          // Live chat fields
          liveChatEnabled: data.live_chat_enabled || false,
          liveChatAgentName: data.live_chat_agent_name || 'Support Agent',
          liveChatGreeting: data.live_chat_greeting || 'Hello! How can we help you today?',
          liveChatColor: data.live_chat_color || '#4f46e5',
          liveChatAutoOpen: data.live_chat_auto_open || false,
          liveChatOfflineMessage: data.live_chat_offline_message || 'We are currently offline. Please leave a message and we will get back to you.',
          // Pre-chat form fields
          liveChatRequireEmail: data.live_chat_require_email || false,
          liveChatRequireName: data.live_chat_require_name || true,
          liveChatRequirePhone: data.live_chat_require_phone || false,
          liveChatCustomFields: [],
          // Pre-chat form labels and placeholders
          liveChatNameLabel: 'Name',
          liveChatNamePlaceholder: 'Your name',
          liveChatEmailLabel: 'Email',
          liveChatEmailPlaceholder: 'your@email.com',
          liveChatPhoneLabel: 'Phone',
          liveChatPhonePlaceholder: '+1 (555) 123-4567',
          liveChatButtonText: data.live_chat_button_text || 'Start Live Chat'
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
      greetingMessage: 'Hello! How can we help you today?',
      video: null,
      videoUrl: undefined,
      useVideoPreview: false,
      videoHeight: 200,
      videoAlignment: 'center',
      videoObjectFit: 'cover',
      customIcon: 'message',
      customIconUrl: '',
      buttonSize: 60,
      previewVideoHeight: 120,
      templateId: 'default',
      // Live chat fields
      liveChatEnabled: false,
      liveChatAgentName: 'Support Agent',
      liveChatGreeting: 'Hello! How can we help you today?',
      liveChatColor: '#4f46e5',
      liveChatAutoOpen: false,
      liveChatOfflineMessage: 'We are currently offline. Please leave a message and we will get back to you.',
      // Pre-chat form fields
      liveChatRequireEmail: false,
      liveChatRequireName: true,
      liveChatRequirePhone: false,
      liveChatCustomFields: [],
      // Pre-chat form labels and placeholders
      liveChatNameLabel: 'Name',
      liveChatNamePlaceholder: 'Your name',
      liveChatEmailLabel: 'Email',
      liveChatEmailPlaceholder: 'your@email.com',
      liveChatPhoneLabel: 'Phone',
      liveChatPhonePlaceholder: '+1 (555) 123-4567',
      liveChatButtonText: 'Start Live Chat'
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
