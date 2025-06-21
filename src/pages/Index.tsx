import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { HeroSection } from "@/components/FloatingWidgetBuilder/HeroSection";
import { WidgetForm } from "@/components/FloatingWidgetBuilder/WidgetForm";
import { LivePreview } from "@/components/FloatingWidgetBuilder/LivePreview";
import { CodePreview } from "@/components/FloatingWidgetBuilder/CodePreview";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { HomeBlogs } from "@/components/HomeBlogs";
import { HomeFAQ } from "@/components/HomeFAQ";
import { platformOptions } from "@/components/FloatingWidgetBuilder/constants";
import { Channel, FormData } from "@/components/FloatingWidgetBuilder/types";

const Index = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelType, setSelectedChannelType] = useState('');
  const [channelValue, setChannelValue] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [formData, setFormData] = useState<FormData>({
    video: null,
    buttonColor: '#25d366',
    position: 'right',
    tooltip: '',
    tooltipDisplay: 'hover',
    useVideoPreview: false,
    videoHeight: 200,
    videoAlignment: 'center',
    customIcon: 'message-circle',
    customIconUrl: ''
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { user, loading, signOut } = useAuth();

  // Check for widget to edit on component mount
  useEffect(() => {
    const editWidgetId = localStorage.getItem('editWidgetId');
    if (editWidgetId && user) {
      loadWidgetForEditing(editWidgetId);
      localStorage.removeItem('editWidgetId');
    }
  }, [user]);

  const loadWidgetForEditing = async (widgetId: string) => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('id', widgetId)
        .single();

      if (error) throw error;

      if (data) {
        setEditingWidget(data);
        setWebsiteUrl(data.website_url);
        setWebsiteName(data.name);
        setChannels(data.channels || []);
        setFormData({
          video: null,
          buttonColor: data.button_color,
          position: data.position,
          tooltip: data.tooltip || '',
          tooltipDisplay: data.tooltip_display || 'hover',
          useVideoPreview: data.video_enabled,
          videoHeight: data.video_height || 200,
          videoAlignment: data.video_alignment || 'center',
          customIcon: data.custom_icon_url ? 'custom' : 'message-circle',
          customIconUrl: data.custom_icon_url || ''
        });
        toast.success('Widget loaded - you can edit it now');
      }
    } catch (error) {
      console.error('Error loading widget:', error);
      toast.error('Error loading widget');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Sign out error: " + error.message);
    } else {
      toast.success("Successfully signed out!");
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      toast.success("Video uploaded!");
    } else if (file) {
      toast.error("Video file size must be less than 10MB");
    }
  };

  const handleCustomIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("Please sign in to upload custom icons");
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/icon-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('icons')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('icons')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        customIconUrl: urlData.publicUrl,
        customIcon: 'custom'
      }));

      toast.success("Icon uploaded successfully!");
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('Error uploading icon');
    }
  };

  const handleVideoRemove = () => {
    setFormData(prev => ({
      ...prev,
      video: null,
      useVideoPreview: false
    }));
    if (editingWidget) {
      setEditingWidget(prev => ({
        ...prev,
        video_url: null,
        video_enabled: false
      }));
    }
    toast.success("Video removed");
  };

  const addChannel = () => {
    if (selectedChannelType && channelValue.trim()) {
      const platform = platformOptions.find(p => p.value === selectedChannelType);
      const newChannel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        value: channelValue.trim(),
        label: platform?.label || 'Custom'
      };
      setChannels(prev => [...prev, newChannel]);
      setChannelValue('');
      setSelectedChannelType('');
      toast.success(`${platform?.label || 'Channel'} added successfully!`);
    }
  };

  const removeChannel = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
    toast.success("Channel removed");
  };

  const editChannel = (id: string, newValue: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, value: newValue } : channel
    ));
    toast.success("Channel updated");
  };

  const uploadVideoToStorage = async (videoFile: File): Promise<string | null> => {
    try {
      console.log('Starting video upload process...');
      
      if (!user?.id) {
        console.error('No user ID available');
        toast.error('User not signed in');
        return null;
      }

      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Uploading to path:', fileName);
      
      const { data, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Video upload error:', uploadError);
        toast.error(`Video upload error: ${uploadError.message}`);
        return null;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);
      toast.success('Video uploaded successfully!');
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video');
      return null;
    }
  };

  const createWidget = async () => {
    if (!websiteName || !websiteName.trim()) {
      toast.error("Website name is required");
      return;
    }

    if (!websiteUrl || !websiteUrl.trim()) {
      toast.error("Please enter website URL");
      return;
    }

    if (!channels || channels.length === 0) {
      toast.error("At least 1 contact channel must be added");
      return;
    }

    if (!user) {
      toast.error("Please sign in to create a widget");
      setAuthModalOpen(true);
      return;
    }

    setSaving(true);
    try {
      let videoUrl = editingWidget?.video_url || null;

      if (formData.video) {
        console.log('Uploading new video...');
        const uploadedVideoUrl = await uploadVideoToStorage(formData.video);
        if (uploadedVideoUrl) {
          videoUrl = uploadedVideoUrl;
          console.log('Video uploaded successfully:', videoUrl);
        } else {
          toast.error('Video upload error');
          setSaving(false);
          return;
        }
      }

      if (editingWidget && editingWidget.video_url && !formData.video && !videoUrl) {
        try {
          const oldVideoPath = editingWidget.video_url.split('/').pop();
          if (oldVideoPath) {
            await supabase.storage
              .from('videos')
              .remove([`${user.id}/${oldVideoPath}`]);
          }
        } catch (error) {
          console.log('Error deleting old video:', error);
        }
        videoUrl = null;
      }

      const widgetData = {
        user_id: user.id,
        name: websiteName.trim(),
        website_url: websiteUrl.trim(),
        button_color: formData.buttonColor,
        position: formData.position,
        tooltip: formData.tooltip,
        tooltip_display: formData.tooltipDisplay,
        video_enabled: formData.useVideoPreview,
        video_url: videoUrl,
        video_height: formData.videoHeight || 200,
        video_alignment: formData.videoAlignment || 'center',
        button_style: 'circle',
        custom_icon_url: formData.customIconUrl || '',
        show_on_mobile: true,
        show_on_desktop: true,
        channels: channels,
        updated_at: new Date().toISOString()
      };

      if (editingWidget) {
        const { error } = await supabase
          .from('widgets')
          .update(widgetData)
          .eq('id', editingWidget.id);

        if (error) throw error;
        toast.success('Widget updated and will appear in dashboard!');
      } else {
        const { error } = await supabase
          .from('widgets')
          .insert([widgetData]);

        if (error) throw error;
        toast.success('Widget created and will appear in dashboard!');
      }

      generateCode();

    } catch (error) {
      console.error('Error saving widget:', error);
      toast.error('Error saving widget');
    } finally {
      setSaving(false);
    }
  };

  const generateCode = () => {
    const videoUrl = formData.video ? `https://hiclient.co/uploads/${formData.video.name}` : '';
    
    let scriptCode = `<script src="https://hiclient.co/floating.js"`;
    
    channels.forEach(channel => {
      scriptCode += `\n  data-${channel.type}="${channel.value}"`;
    });
    
    if (videoUrl) {
      scriptCode += `\n  data-video="${videoUrl}"`;
    }
    
    scriptCode += `\n  data-position="${formData.position}"`;
    scriptCode += `\n  data-color="${formData.buttonColor}"`;
    
    if (formData.tooltip) {
      scriptCode += `\n  data-tooltip="${formData.tooltip}"`;
    }

    if (formData.useVideoPreview) {
      scriptCode += `\n  data-video-preview="true"`;
    }
    
    scriptCode += `>\n</script>`;

    setGeneratedCode(scriptCode);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        user={user}
        loading={loading}
        onSignOut={handleSignOut}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <div className="container mx-auto px-4 py-16">
        <HeroSection />

        {/* Main Content - Widget Builder */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8 mb-16">
          {/* Left Side - Form and Code (3 columns) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Widget Form */}
            <WidgetForm
              websiteName={websiteName}
              websiteUrl={websiteUrl}
              channels={channels}
              selectedChannelType={selectedChannelType}
              channelValue={channelValue}
              formData={formData}
              editingWidget={editingWidget}
              saving={saving}
              onWebsiteNameChange={setWebsiteName}
              onWebsiteUrlChange={setWebsiteUrl}
              onChannelsChange={setChannels}
              onSelectedChannelTypeChange={setSelectedChannelType}
              onChannelValueChange={setChannelValue}
              onAddChannel={addChannel}
              onRemoveChannel={removeChannel}
              onEditChannel={editChannel}
              onVideoUpload={handleVideoUpload}
              onVideoRemove={handleVideoRemove}
              onFormDataChange={handleInputChange}
              onCreateWidget={createWidget}
              onCustomIconUpload={handleCustomIconUpload}
            />

            {/* Code Preview Section */}
            <CodePreview
              generatedCode={generatedCode}
              copied={copied}
              onCopy={copyToClipboard}
            />
          </div>

          {/* Right Side - Live Preview (1 column, fixed position) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <LivePreview
                showWidget={showWidget}
                formData={formData}
                channels={channels}
                videoModalOpen={videoModalOpen}
                onVideoModalOpenChange={setVideoModalOpen}
                editingWidget={editingWidget}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blog and FAQ Sections */}
      <HomeBlogs />
      <HomeFAQ />

      <Footer />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
