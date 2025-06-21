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
import { Channel, FormData } from "@/components/FloatingWidgetBuilder/types";
import { platformOptions } from "@/components/FloatingWidgetBuilder/constants";

const Index = () => {
  const { user, loading } = useAuth();
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelType, setSelectedChannelType] = useState('');
  const [channelValue, setChannelValue] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingWidget, setEditingWidget] = useState<any>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
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
          customIcon: null,
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleAddChannel = () => {
    if (selectedChannelType && channelValue.trim()) {
      // Find the platform to get the label
      const platform = platformOptions.find(p => p.value === selectedChannelType);
      const newChannel = {
        id: Date.now().toString(),
        type: selectedChannelType,
        value: channelValue.trim(),
        label: platform?.label || selectedChannelType
      };
      setChannels(prev => [...prev, newChannel]);
      setChannelValue('');
      setSelectedChannelType('');
      toast.success('Channel added!');
    }
  };

  const handleRemoveChannel = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
    toast.success('Channel removed!');
  };

  const handleEditChannel = (id: string, newValue: string) => {
    setChannels(prev => prev.map(channel =>
      channel.id === id ? { ...channel, value: newValue } : channel
    ));
    toast.success('Channel updated!');
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        video: file
      }));
      toast.success('Video uploaded!');
    }
  };

  const handleVideoRemove = () => {
    setFormData(prev => ({
      ...prev,
      video: null
    }));
    toast.success('Video removed!');
  };

  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For simplicity, we'll just store the local URL
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        customIcon: file,
        customIconUrl: url
      }));
      toast.success('Custom icon uploaded!');
    }
  };

  const handleFormDataChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateWidget = async () => {
    if (!websiteName.trim() || !websiteUrl.trim()) {
      toast.error('Website name and URL are required');
      return;
    }

    setSaving(true);
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
        // Update existing widget
        const { error } = await supabase
          .from('widgets')
          .update(widgetData)
          .eq('id', editingWidget.id);

        if (error) throw error;
        toast.success('Widget updated!');
      } else {
        // Create new widget
        const { error } = await supabase
          .from('widgets')
          .insert([widgetData]);

        if (error) throw error;
        toast.success('Widget created!');
      }

      // Clear editing widget and form
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
    } catch (error) {
      console.error('Error saving widget:', error);
      toast.error('Error saving widget');
    } finally {
      setSaving(false);
    }
  };

  // Generate widget code
  useEffect(() => {
    if (websiteUrl && channels.length > 0) {
      const code = `<script>
(function() {
  // Widget configuration
  const config = {
    channels: ${JSON.stringify(channels)},
    buttonColor: "${formData.buttonColor}",
    position: "${formData.position}",
    tooltip: "${formData.tooltip}",
    useVideo: ${formData.useVideoPreview}
  };
  
  // Create widget HTML
  const widgetHTML = \`
    <div id="floating-widget" style="position:fixed;${formData.position}:20px;bottom:20px;z-index:9999;">
      <button style="width:60px;height:60px;border-radius:50%;background:\${config.buttonColor};border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
    </div>
  \`;
  
  // Insert widget into page
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
})();
</script>`;
      setGeneratedCode(code);
    } else {
      setGeneratedCode('');
    }
  }, [websiteUrl, channels, formData]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success('Code copied to clipboard!');
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
      
      <main>
        <HeroSection />
        
        <section className="py-16 bg-white/50" id="widget-form">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
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
                onAddChannel={handleAddChannel}
                onRemoveChannel={handleRemoveChannel}
                onEditChannel={handleEditChannel}
                onVideoUpload={handleVideoUpload}
                onVideoRemove={handleVideoRemove}
                onFormDataChange={handleFormDataChange}
                onCreateWidget={handleCreateWidget}
                onCustomIconUpload={handleCustomIconUpload}
              />
              
              <div className="space-y-6">
                <LivePreview
                  showWidget={channels.length > 0}
                  formData={formData}
                  channels={channels}
                  videoModalOpen={videoModalOpen}
                  onVideoModalOpenChange={setVideoModalOpen}
                  editingWidget={editingWidget}
                />
                
                <CodePreview
                  generatedCode={generatedCode}
                  copied={copied}
                  onCopy={handleCopyCode}
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
