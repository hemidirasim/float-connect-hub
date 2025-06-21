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

  const handleEditChannel = (id: string, newValue: string) => {
    setChannels(channels.map(channel =>
      channel.id === id ? { ...channel, value: newValue } : channel
    ));
    toast.success('Channel updated!');
  };

  const handleCreateWidget = async () => {
    if (!websiteName.trim() || !websiteUrl.trim()) {
      toast.error('Website name and URL are required');
      return false;
    }

    if (channels.length === 0) {
      toast.error('At least 1 contact channel is required');
      return false;
    }

    try {
      const widgetData = {
        name: websiteName,
        website_url: websiteUrl,
        button_color: formData.buttonColor,
        position: formData.position,
        tooltip: formData.tooltip,
        tooltip_display: formData.tooltipDisplay,
        video_enabled: formData.useVideoPreview,
        video_height: formData.videoHeight,
        video_alignment: formData.videoAlignment,
        custom_icon_url: formData.customIconUrl,
        channels: channels,
        user_id: user?.id,
        updated_at: new Date().toISOString()
      };

      if (editingWidget) {
        const { error } = await supabase
          .from('widgets')
          .update(widgetData)
          .eq('id', editingWidget.id);

        if (error) throw error;
        toast.success('Widget updated!');
      } else {
        const { error } = await supabase
          .from('widgets')
          .insert([widgetData]);

        if (error) throw error;
        toast.success('Widget created!');
        // Don't reset form after creation - user requested to keep data
      }
      return true;
    } catch (error) {
      console.error('Error saving widget:', error);
      toast.error('Error saving widget');
      return false;
    }
  };

  return {
    handleAddChannel,
    handleRemoveChannel,
    handleEditChannel,
    handleCreateWidget
  };
};
