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
      let code = '';
      
      // Simple single WhatsApp button
      if (channels.length === 1 && channels[0].type === 'whatsapp') {
        const whatsappNumber = channels[0].value.replace(/[^0-9]/g, '');
        code = `<div style="position:fixed;${formData.position}:20px;bottom:20px;z-index:9999;">
  <a href="https://wa.me/${whatsappNumber}" target="_blank" style="display:block;width:60px;height:60px;background:${formData.buttonColor};border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.3);text-decoration:none;">
    <svg style="width:24px;height:24px;margin:18px;" fill="white" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
    </svg>
  </a>
</div>`;
      } else {
        // Multi-channel widget (keep existing complex code for multiple channels)
        code = `<script>
(function() {
  const config = {
    channels: ${JSON.stringify(channels)},
    buttonColor: "${formData.buttonColor}",
    position: "${formData.position}",
    tooltip: "${formData.tooltip}",
    tooltipDisplay: "${formData.tooltipDisplay}",
    customIconUrl: "${formData.customIconUrl}"
  };
  
  const widgetHTML = \`<div id="floating-widget" style="position:fixed;\${config.position}:20px;bottom:20px;z-index:9999;">
    <button style="width:60px;height:60px;border-radius:50%;background:\${config.buttonColor};border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);position:relative;">
      \${config.customIconUrl ? '<img src="' + config.customIconUrl + '" alt="Contact" style="width:24px;height:24px;border-radius:50%;">' : '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>'}
      \${config.tooltipDisplay === 'always' ? '<div style="position:absolute;' + (config.position === 'left' ? 'left:70px;' : 'right:70px;') + 'bottom:50%;transform:translateY(50%);background:black;color:white;padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;">' + config.tooltip + '</div>' : ''}
    </button>
  </div>\`;
  
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  document.getElementById('floating-widget').addEventListener('click', function() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background:white;padding:20px;border-radius:10px;max-width:400px;width:90%;';
    
    let html = '<h3 style="margin:0 0 15px 0;">Contact Us</h3>';
    config.channels.forEach(channel => {
      const url = channel.type === 'whatsapp' ? 'https://wa.me/' + channel.value.replace(/[^0-9]/g, '') :
                  channel.type === 'telegram' ? 'https://t.me/' + channel.value.replace('@', '') :
                  channel.type === 'email' ? 'mailto:' + channel.value :
                  channel.type === 'phone' ? 'tel:' + channel.value : channel.value;
      html += \`<div style="padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:5px;cursor:pointer;" onclick="window.open('\${url}', '_blank')">
        <strong>\${channel.label}</strong><br><small>\${channel.value}</small>
      </div>\`;
    });
    html += '<button onclick="this.closest(\\'[style*=\"position:fixed\"]\\'). remove()" style="margin-top:15px;padding:8px 16px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer;">Close</button>';
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
  });
})();
</script>`;
      }
      
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
