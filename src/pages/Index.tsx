
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
        customIcon: 'custom',
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
        
        // Don't clear the form after update, just update the editingWidget state
        setEditingWidget({ ...editingWidget, ...widgetData });
      } else {
        // Create new widget
        const { error } = await supabase
          .from('widgets')
          .insert([widgetData]);

        if (error) throw error;
        toast.success('Widget created!');

        // Clear form only after creating new widget
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
      }
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
    tooltipDisplay: "${formData.tooltipDisplay}",
    useVideo: ${formData.useVideoPreview},
    customIconUrl: "${formData.customIconUrl}"
  };
  
  // Create widget HTML
  const widgetHTML = \`
    <div id="floating-widget" style="position:fixed;\${config.position}:20px;bottom:20px;z-index:9999;">
      <button style="width:60px;height:60px;border-radius:50%;background:\${config.buttonColor};border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);position:relative;">
        \${config.customIconUrl ? 
          '<img src="' + config.customIconUrl + '" alt="Contact" style="width:24px;height:24px;border-radius:50%;">' :
          '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'
        }
        \${config.tooltipDisplay === 'always' ? 
          '<div style="position:absolute;' + (config.position === 'left' ? 'left:70px;' : 'right:70px;') + 'bottom:50%;transform:translateY(50%);background:black;color:white;padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;">' + config.tooltip + '</div>' : 
          ''
        }
      </button>
    </div>
  \`;
  
  // Insert widget into page
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  // Add click functionality
  document.getElementById('floating-widget').addEventListener('click', function() {
    // Create modal for channels
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background:white;padding:20px;border-radius:10px;max-width:400px;width:90%;max-height:80vh;overflow-y:auto;';
    
    let channelHTML = '<h3 style="margin:0 0 15px 0;">Contact Us</h3>';
    config.channels.forEach(channel => {
      channelHTML += \`<div style="display:flex;align-items:center;padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;cursor:pointer;" onclick="window.open('\${getChannelUrl(channel)}', '_blank')">
        <div style="width:40px;height:40px;border-radius:50%;background:#007bff;display:flex;align-items:center;justify-content:center;margin-right:10px;color:white;font-weight:bold;">\${channel.label.charAt(0)}</div>
        <div><strong>\${channel.label}</strong><br><small>\${channel.value}</small></div>
      </div>\`;
    });
    channelHTML += '<button onclick="this.closest(\\'[style*=\"position:fixed\"]\\'). remove()" style="margin-top:15px;padding:8px 16px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">Close</button>';
    
    content.innerHTML = channelHTML;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
  });
  
  function getChannelUrl(channel) {
    switch(channel.type) {
      case 'whatsapp': return 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '');
      case 'telegram': return 'https://t.me/' + channel.value.replace('@', '');
      case 'email': return 'mailto:' + channel.value;
      case 'phone': return 'tel:' + channel.value;
      default: return channel.value;
    }
  }
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
