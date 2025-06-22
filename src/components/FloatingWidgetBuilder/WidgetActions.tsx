
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Channel, FormData } from "./types";
import { platformOptions } from "./constants";

export const useWidgetActions = (
  user: any,
  websiteName: string,
  websiteUrl: string,
  channels: Channel[],
  formData: FormData,
  editingWidget: any,
  resetForm: () => void,
  setChannels: (channels: Channel[]) => void,
  setChannelValue: (value: string) => void,
  setSelectedChannelType: (type: string) => void
) => {
  const handleAddChannel = (selectedChannelType: string, channelValue: string) => {
    if (selectedChannelType && channelValue.trim()) {
      const platform = platformOptions.find(p => p.value === selectedChannelType);
      const newChannel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        value: channelValue.trim(),
        label: platform?.label || selectedChannelType
      };
      setChannels([...channels, newChannel]);
      setChannelValue('');
      setSelectedChannelType('');
      toast.success('Channel added!');
    }
  };

  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter(channel => channel.id !== id));
    toast.success('Channel removed!');
  };

  // Updated to handle both value and label
  const handleEditChannel = (id: string, newValue: string, newLabel: string) => {
    setChannels(channels.map(channel =>
      channel.id === id ? { 
        ...channel, 
        value: newValue,
        label: newLabel // Make sure to update the label
      } : channel
    ));
    toast.success('Channel updated!');
  };

  const handleCreateWidget = async () => {
    if (!user) {
      toast.error('You must be logged in to create a widget');
      return { success: false };
    }

    if (!websiteName.trim() || !websiteUrl.trim()) {
      toast.error('Website name and URL are required');
      return { success: false };
    }

    if (channels.length === 0) {
      toast.error('At least 1 contact channel is required');
      return { success: false };
    }

    try {
      console.log('Saving widget to database with channels:', channels);
      
      // Create widget data including new fields
      const widgetData = {
        name: websiteName,
        website_url: websiteUrl,
        button_color: formData.buttonColor,
        position: formData.position,
        tooltip: formData.tooltip,
        tooltip_display: formData.tooltipDisplay,
        tooltip_position: formData.tooltipPosition || 'top',
        greeting_message: formData.greetingMessage || 'Hello! How can we help you today?',
        video_enabled: formData.useVideoPreview,
        video_url: formData.videoUrl || null,
        video_height: formData.videoHeight,
        video_alignment: formData.videoAlignment,
        custom_icon_url: formData.customIcon === 'custom' ? formData.customIconUrl : null,
        button_size: formData.buttonSize,
        preview_video_height: formData.previewVideoHeight,
        template_id: formData.templateId || 'default',
        channels: channels, // Save channels with both label and value
        user_id: user?.id
      };

      console.log('Widget data for database with channels:', widgetData);

      let savedWidget;

      if (editingWidget) {
        console.log('Updating existing widget:', editingWidget.id);
        const { data, error } = await supabase
          .from('widgets')
          .update({ ...widgetData, updated_at: new Date().toISOString() })
          .eq('id', editingWidget.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating widget:', error);
          throw error;
        }
        savedWidget = data;
        toast.success('Widget updated! Changes will appear on your website within 1 minute.');
      } else {
        console.log('Creating new widget');
        const { data, error } = await supabase
          .from('widgets')
          .insert([widgetData])
          .select()
          .single();

        if (error) {
          console.error('Error creating widget:', error);
          throw error;
        }
        savedWidget = data;
        toast.success('Widget created!');
      }
      
      console.log('Widget saved to database successfully with channels:', savedWidget);
      
      return { success: true, widget: savedWidget };
    } catch (error) {
      console.error('Database error:', error);
      
      // More specific error messages
      if (error.message?.includes('duplicate key')) {
        toast.error('A widget with this name already exists');
      } else if (error.message?.includes('invalid input')) {
        toast.error('Please check your input data');
      } else if (error.message?.includes('permission')) {
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(`Error saving widget: ${error.message || 'Unknown error'}`);
      }
      
      return { success: false, error: error.message };
    }
  };

  return {
    handleAddChannel,
    handleRemoveChannel,
    handleEditChannel,
    handleCreateWidget
  };
};
