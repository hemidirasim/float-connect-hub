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
    useVideoPreview: false,
    videoHeight: 200,
    videoAlignment: 'center'
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
          useVideoPreview: data.video_enabled,
          videoHeight: data.video_height || 200,
          videoAlignment: data.video_alignment || 'center'
        });
        toast.success('Widget yükləndi - redaktə edə bilərsiniz');
      }
    } catch (error) {
      console.error('Error loading widget:', error);
      toast.error('Widget yüklənməkdə xəta');
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Çıxış xətası: " + error.message);
    } else {
      toast.success("Uğurla çıxdınız!");
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
      toast.success("Video yükləndi!");
    } else if (file) {
      toast.error("Video faylının ölçüsü 10MB-dan az olmalıdır");
    }
  };

  const handleVideoRemove = () => {
    setFormData(prev => ({
      ...prev,
      video: null,
      useVideoPreview: false
    }));
    // If editing widget, also mark that video should be removed from database
    if (editingWidget) {
      setEditingWidget(prev => ({
        ...prev,
        video_url: null,
        video_enabled: false
      }));
    }
    toast.success("Video silindi");
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
      toast.success(`${platform?.label || 'Channel'} uğurla əlavə edildi!`);
    }
  };

  const removeChannel = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
    toast.success("Kanal silindi");
  };

  const editChannel = (id: string, newValue: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, value: newValue } : channel
    ));
    toast.success("Kanal yeniləndi");
  };

  const uploadVideoToStorage = async (videoFile: File): Promise<string | null> => {
    try {
      console.log('Starting video upload process...');
      
      if (!user?.id) {
        console.error('No user ID available');
        toast.error('İstifadəçi giriş etməyib');
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
        toast.error(`Video yükləmə xətası: ${uploadError.message}`);
        return null;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);
      toast.success('Video uğurla yükləndi!');
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Video yükləməkdə xəta baş verdi');
      return null;
    }
  };

  const createWidget = async () => {
    // Website name validation - must be filled
    if (!websiteName || !websiteName.trim()) {
      toast.error("Website adı tələb olunur");
      return;
    }

    // Website URL validation - must be filled
    if (!websiteUrl || !websiteUrl.trim()) {
      toast.error("Website URL-i daxil edin");
      return;
    }

    // Minimum 1 channel validation - array must have at least 1 item
    if (!channels || channels.length === 0) {
      toast.error("Minimum 1 ədəd contact channel əlavə edilməlidir");
      return;
    }

    if (!user) {
      toast.error("Widget yaratmaq üçün hesabınıza giriş edin");
      setAuthModalOpen(true);
      return;
    }

    setSaving(true);
    try {
      let videoUrl = editingWidget?.video_url || null;

      // Upload new video if selected
      if (formData.video) {
        console.log('Uploading new video...');
        const uploadedVideoUrl = await uploadVideoToStorage(formData.video);
        if (uploadedVideoUrl) {
          videoUrl = uploadedVideoUrl;
          console.log('Video uploaded successfully:', videoUrl);
        } else {
          toast.error('Video yükləmə xətası');
          setSaving(false);
          return;
        }
      }

      // If video was removed and we're editing, delete old video and set to null
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
        video_enabled: formData.useVideoPreview,
        video_url: videoUrl,
        video_height: formData.videoHeight || 200,
        video_alignment: formData.videoAlignment || 'center',
        button_style: 'circle',
        custom_icon_url: '',
        show_on_mobile: true,
        show_on_desktop: true,
        channels: channels,
        updated_at: new Date().toISOString()
      };

      if (editingWidget) {
        // Update existing widget
        const { error } = await supabase
          .from('widgets')
          .update(widgetData)
          .eq('id', editingWidget.id);

        if (error) throw error;
        toast.success('Widget yeniləndi və dashboardda görünəcək!');
      } else {
        // Create new widget
        const { error } = await supabase
          .from('widgets')
          .insert([widgetData]);

        if (error) throw error;
        toast.success('Widget yaradıldı və dashboardda görünəcək!');
      }

      // Generate code after successful save
      generateCode();

    } catch (error) {
      console.error('Error saving widget:', error);
      toast.error('Widget saxlanılarkən xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  const generateCode = () => {
    const videoUrl = formData.video ? `https://yourdomain.com/uploads/${formData.video.name}` : '';
    
    let scriptCode = `<script src="https://yourdomain.com/floating.js"`;
    
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
    toast.success("Kod kopyalandı!");
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

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <HeroSection />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
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
          />

          {/* Live Preview Section */}
          <div className="space-y-6">
            <LivePreview
              showWidget={showWidget}
              formData={formData}
              channels={channels}
              videoModalOpen={videoModalOpen}
              onVideoModalOpenChange={setVideoModalOpen}
              editingWidget={editingWidget}
            />

            {/* Code Preview Section */}
            <CodePreview
              generatedCode={generatedCode}
              copied={copied}
              onCopy={copyToClipboard}
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
