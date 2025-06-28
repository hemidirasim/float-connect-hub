import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from "@/components/FloatingWidgetBuilder/HeroSection";
import { WidgetForm } from "@/components/FloatingWidgetBuilder/WidgetForm";
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
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    websiteName,
    setWebsiteName,
    websiteUrl,
    setWebsiteUrl,
    channels,
    setChannels,
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
    () => {}, // setChannelValue - not needed anymore
    () => {}  // setSelectedChannelType - not needed anymore
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
      toast.success('Uğurla çıxış edildi!', {
        description: 'Hesabınızdan çıxış etdiniz'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Çıxış zamanı xəta baş verdi', {
        description: 'Zəhmət olmasa yenidən cəhd edin'
      });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Video fayl 10MB-dan kiçik olmalıdır', {
        description: 'Zəhmət olmasa daha kiçik fayl seçin'
      });
      return;
    }

    if (!user) {
      toast.error('Video yükləmək üçün daxil olmalısınız', {
        description: 'Zəhmət olmasa hesabınıza daxil olun'
      });
      setAuthModalOpen(true);
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

      toast.success('Video uğurla yükləndi!', {
        description: 'Video sizin widget-ə əlavə edildi'
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Video yükləmədə xəta', {
        description: 'Zəhmət olmasa yenidən cəhd edin'
      });
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
    toast.success('Video silindi!', {
      description: 'Video widget-dən çıxarıldı'
    });
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
      toast.success('Xüsusi ikon yükləndi!', {
        description: 'Widget-dən istifadə edə bilərsiniz'
      });
    }
  };

  const handleFormDataChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => {
      // When changing customIcon to a preset icon, clear the custom icon URL
      if (field === 'customIcon' && value !== 'custom') {
        return {
          ...prev,
          [field]: value as string, // Ensure customIcon is always a string
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
    if (!user) {
      // Show login modal if user is not authenticated
      setAuthModalOpen(true);
      return;
    }
    
    setSaving(true);
    const result = await createWidget();
    
    if (result?.success && result?.widget) {
      // Update the editing widget state with the newly created/updated widget
      setEditingWidget(result.widget);
    }
    
    setSaving(false);
  };

  // SEO configuration
  const seoConfig = {
    title: 'Hiclient - Saytınız üçün İnteraktiv Floating Widget Yaradın | Müştəri Məmnuniyyəti Platforması',
    description: 'Saytınız üçün peşəkar floating widget-lər yaradın. Video inteqrasiyası, çoxkanal dəstəyi (WhatsApp, Telegram, Email). Asan quraşdırma, kodlaşdırma tələb olunmur. Müştəri məmnuniyyətini artırın.',
    keywords: 'floating widget, website widget, müştəri məmnuniyyəti, whatsapp widget, telegram widget, video widget, website popup, əlaqə widget, müştəri dəstəyi widget, live chat alternativ',
    canonicalUrl: 'https://hiclient.co/',
    ogTitle: 'Hiclient - Saytınız üçün İnteraktiv Floating Widget Yaradın',
    ogDescription: 'Saytınız üçün peşəkar floating widget-lər yaradın. Video inteqrasiyası, çoxkanal dəstəyi (WhatsApp, Telegram, Email). Asan quraşdırma, kodlaşdırma tələb olunmur.',
    ogType: 'website',
    twitterTitle: 'Hiclient - Saytınız üçün İnteraktiv Floating Widget Yaradın',
    twitterDescription: 'Saytınız üçün peşəkar floating widget-lər yaradın. Video inteqrasiyası, çoxkanal dəstəyi (WhatsApp, Telegram, Email). Asan quraşdırma, kodlaşdırma tələb olunmur.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Hiclient",
      "url": "https://hiclient.co",
      "description": "Saytınız üçün peşəkar floating widget-lər yaradın",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://hiclient.co/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Hiclient",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hiclient.co/logo.png"
        }
      }
    }
  };

  const { helmet } = useSEO(seoConfig);

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
    toast.success('Kod kopyalandı!', {
      description: 'Widget kodu panoya köçürüldü'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {helmet}
      
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
              <div className="max-w-4xl mx-auto space-y-6">
                <WidgetForm
                  websiteName={websiteName}
                  websiteUrl={websiteUrl}
                  channels={channels}
                  formData={formData}
                  editingWidget={editingWidget}
                  saving={saving}
                  uploading={uploading}
                  onWebsiteNameChange={setWebsiteName}
                  onWebsiteUrlChange={setWebsiteUrl}
                  onChannelsChange={setChannels}
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
    </>
  );
};

export default Index;
