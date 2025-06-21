import React, { useState, useEffect } from 'react';
import { HeroSection } from "@/components/FloatingWidgetBuilder/HeroSection";
import { WidgetForm } from "@/components/FloatingWidgetBuilder/WidgetForm";
import { LivePreview } from "@/components/FloatingWidgetBuilder/LivePreview";
import { CodePreview } from "@/components/FloatingWidgetBuilder/CodePreview";
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { AuthModal } from "@/components/AuthModal";
import { HomeBlogs } from "@/components/HomeBlogs";
import { HomeFAQ } from "@/components/HomeFAQ";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useWidgetState } from "@/hooks/useWidgetState";
import { useWidgetActions } from "@/components/FloatingWidgetBuilder/WidgetActions";
import { generateWidgetCode } from "@/utils/codeGenerator";

const Index = () => {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
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
  } = useWidgetState(user);

  const {
    handleAddChannel,
    handleRemoveChannel,
    handleEditChannel,
    handleCreateWidget: createWidget
  } = useWidgetActions(
    user,
    websiteName,
    websiteUrl,
    channels,
    formData,
    editingWidget,
    resetForm,
    setChannels,
    setChannelValue,
    setSelectedChannelType
  );

  // Check for hash navigation and scroll to widget form
  useEffect(() => {
    if (window.location.hash === '#widget-form') {
      setTimeout(() => {
        const element = document.getElementById('widget-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleAddChannelWrapper = () => {
    handleAddChannel(selectedChannelType, channelValue);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Video file must be less than 10MB');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to upload videos');
      return;
    }

    setUploading(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Update form data with the video URL
      setFormData(prev => ({
        ...prev,
        video: file,
        videoUrl: publicUrl
      }));

      toast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoRemove = async () => {
    if (formData.videoUrl && user) {
      try {
        // Extract file path from URL
        const url = new URL(formData.videoUrl);
        const filePath = url.pathname.split('/').slice(-2).join('/'); // user_id/filename
        
        // Delete from storage
        await supabase.storage
          .from('videos')
          .remove([filePath]);
      } catch (error) {
        console.error('Error removing video from storage:', error);
      }
    }

    setFormData(prev => ({
      ...prev,
      video: null,
      videoUrl: undefined
    }));
    toast.success('Video removed!');
  };

  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        customIcon: 'custom',
        customIconUrl: url
      }));
      toast.success('Custom icon uploaded!');
    }
  };

  const handleFormDataChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => {
      // When changing customIcon to a preset icon, clear the custom icon URL
      if (field === 'customIcon' && value !== 'custom') {
        return {
          ...prev,
          [field]: value,
          customIconUrl: '' // Clear custom icon URL when switching to preset icons
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleCreateWidgetWrapper = async () => {
    setSaving(true);
    const result = await createWidget();
    
    if (result?.success && result?.widget) {
      // Update the editing widget state with the newly created/updated widget
      setEditingWidget(result.widget);
    }
    
    setSaving(false);
  };

  // Generate widget code - now includes the widget ID from editingWidget
  useEffect(() => {
    const code = generateWidgetCode(
      websiteUrl, 
      channels, 
      formData, 
      editingWidget?.id // Pass widget ID if editing existing widget
    );
    setGeneratedCode(code);
  }, [websiteUrl, channels, formData, editingWidget, setGeneratedCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header 
        user={user} 
        loading={loading} 
        onSignOut={handleSignOut}
        onOpenAuth={() => setAuthModalOpen(true)}
      />
      
      <main>
        <HeroSection />
        
        <section className="py-20 bg-white/30 backdrop-blur-sm" id="widget-form">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              <div className="space-y-6">
                <WidgetForm
                  websiteName={websiteName}
                  websiteUrl={websiteUrl}
                  channels={channels}
                  selectedChannelType={selectedChannelType}
                  channelValue={channelValue}
                  formData={formData}
                  editingWidget={editingWidget}
                  saving={saving}
                  uploading={uploading}
                  onWebsiteNameChange={setWebsiteName}
                  onWebsiteUrlChange={setWebsiteUrl}
                  onChannelsChange={setChannels}
                  onSelectedChannelTypeChange={setSelectedChannelType}
                  onChannelValueChange={setChannelValue}
                  onAddChannel={handleAddChannelWrapper}
                  onRemoveChannel={handleRemoveChannel}
                  onEditChannel={handleEditChannel}
                  onVideoUpload={handleVideoUpload}
                  onVideoRemove={handleVideoRemove}
                  onFormDataChange={handleFormDataChange}
                  onCreateWidget={handleCreateWidgetWrapper}
                  onCustomIconUpload={handleCustomIconUpload}
                />
                
                {generatedCode && (
                  <CodePreview
                    generatedCode={generatedCode}
                    copied={copied}
                    onCopy={handleCopyCode}
                  />
                )}
              </div>
              
              <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
                <LivePreview
                  showWidget={channels.length > 0}
                  formData={formData}
                  channels={channels}
                  videoModalOpen={videoModalOpen}
                  onVideoModalOpenChange={setVideoModalOpen}
                  editingWidget={editingWidget}
                />
              </div>
            </div>
          </div>
        </section>

        <HomeBlogs />
        <HomeFAQ />
      </main>

      <Footer />
      
      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
    </div>
  );
};

export default Index;
