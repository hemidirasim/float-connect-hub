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
      toast.success('Successfully signed out!', {
        description: 'You have been logged out of your account'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out', {
        description: 'Please try again'
      });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Video file must be smaller than 10MB', {
        description: 'Please select a smaller file'
      });
      return;
    }

    if (!user) {
      toast.error('You must be logged in to upload videos', {
        description: 'Please sign in to your account'
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

      toast.success('Video uploaded successfully!', {
        description: 'Video has been added to your widget'
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video', {
        description: 'Please try again'
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
    toast.success('Video removed!', {
      description: 'Video has been removed from widget'
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
      toast.success('Custom icon uploaded!', {
        description: 'You can now use it in your widget'
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

  // Enhanced SEO configuration - all in English
  const seoConfig = {
    title: 'Hiclient - Create Interactive Floating Widgets for Your Website | Customer Engagement Platform',
    description: 'Create professional floating widgets for your website with video integration, multi-channel support (WhatsApp, Telegram, Email). Easy setup, no coding required. Boost customer satisfaction and conversions by 40%.',
    keywords: 'floating widget, website widget, customer engagement, whatsapp widget, telegram widget, video widget, website popup, contact widget, customer support widget, live chat alternative, website conversion, customer satisfaction, lead generation, multi-channel communication',
    canonicalUrl: 'https://hiclient.co/',
    ogTitle: 'Hiclient - Create Interactive Floating Widgets for Your Website',
    ogDescription: 'Create professional floating widgets for your website with video integration and multi-channel support. Easy setup, no coding required. Boost customer engagement and conversions.',
    ogImage: 'https://hiclient.co/og-image.png',
    ogType: 'website',
    twitterTitle: 'Hiclient - Create Interactive Floating Widgets for Your Website',
    twitterDescription: 'Create professional floating widgets with video integration and multi-channel support. Easy setup, no coding required.',
    twitterImage: 'https://hiclient.co/twitter-image.png',
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://hiclient.co/#website",
          "url": "https://hiclient.co/",
          "name": "Hiclient",
          "description": "Create professional floating widgets for your website with video integration and multi-channel support. Boost customer engagement and conversions.",
          "publisher": {
            "@id": "https://hiclient.co/#organization"
          },
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://hiclient.co/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          ],
          "inLanguage": "en-US"
        },
        {
          "@type": "Organization",
          "@id": "https://hiclient.co/#organization",
          "name": "Hiclient",
          "url": "https://hiclient.co/",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://hiclient.co/#logo",
            "inLanguage": "en-US",
            "url": "https://hiclient.co/logo.png",
            "contentUrl": "https://hiclient.co/logo.png",
            "width": 512,
            "height": 512,
            "caption": "Hiclient - Interactive Floating Widget Builder"
          },
          "image": {
            "@id": "https://hiclient.co/#logo"
          },
          "description": "Hiclient helps businesses create professional floating widgets for their websites to improve customer engagement, boost conversions, and enhance customer satisfaction through multi-channel communication.",
          "foundingDate": "2024",
          "sameAs": [
            "https://twitter.com/hiclient",
            "https://linkedin.com/company/hiclient",
            "https://facebook.com/hiclient"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English"]
          }
        },
        {
          "@type": "WebPage",
          "@id": "https://hiclient.co/#webpage",
          "url": "https://hiclient.co/",
          "name": "Hiclient - Create Interactive Floating Widgets for Your Website",
          "isPartOf": {
            "@id": "https://hiclient.co/#website"
          },
          "about": {
            "@id": "https://hiclient.co/#organization"
          },
          "description": "Create professional floating widgets for your website with video integration, multi-channel support (WhatsApp, Telegram, Email). Easy setup, no coding required. Boost customer engagement and conversions.",
          "breadcrumb": {
            "@id": "https://hiclient.co/#breadcrumb"
          },
          "inLanguage": "en-US",
          "potentialAction": [
            {
              "@type": "ReadAction",
              "target": ["https://hiclient.co/"]
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://hiclient.co/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://hiclient.co/"
            }
          ]
        },
        {
          "@type": "SoftwareApplication",
          "name": "Hiclient Widget Builder",
          "description": "Professional floating widget builder for websites with video integration and multi-channel support. Create engaging customer touchpoints without coding.",
          "url": "https://hiclient.co/",
          "applicationCategory": "WebApplication",
          "operatingSystem": "Web Browser",
          "browserRequirements": "Requires JavaScript. Compatible with all modern browsers.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free widget builder with premium features available",
            "availability": "https://schema.org/InStock"
          },
          "author": {
            "@id": "https://hiclient.co/#organization"
          },
          "publisher": {
            "@id": "https://hiclient.co/#organization"
          },
          "featureList": [
            "Video Integration",
            "Multi-Channel Support",
            "WhatsApp Integration",
            "Telegram Integration", 
            "Email Integration",
            "No Coding Required",
            "Customizable Design",
            "Mobile Responsive",
            "Real-time Preview",
            "Easy Installation"
          ],
          "screenshot": "https://hiclient.co/app-screenshot.png",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          }
        },
        {
          "@type": "Service",
          "name": "Website Widget Creation Service",
          "description": "Professional service for creating floating widgets that improve customer engagement on websites. Increase conversions and customer satisfaction with multi-channel communication tools.",
          "provider": {
            "@id": "https://hiclient.co/#organization"
          },
          "areaServed": "Worldwide",
          "availableLanguage": ["English"],
          "serviceType": "Web Development Service",
          "category": "Customer Engagement Tools",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Widget Creation Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Basic Widget Creation",
                  "description": "Create simple floating widgets with basic channel support"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "Advanced Widget Creation",
                  "description": "Create advanced floating widgets with video integration and multi-channel support"
                }
              }
            ]
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I create a floating widget for my website?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "With Hiclient, you can create a floating widget in minutes. Simply enter your website details, choose your channels (WhatsApp, Telegram, Email), customize the design, and copy the generated code to your website."
              }
            },
            {
              "@type": "Question", 
              "name": "Do I need coding skills to use Hiclient?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No coding skills required! Hiclient provides a user-friendly interface where you can create and customize your floating widget visually, then simply copy and paste the generated code into your website."
              }
            },
            {
              "@type": "Question",
              "name": "What channels can I add to my floating widget?",
              "acceptedAnswer": {
                "@type": "Answer", 
                "text": "You can add multiple communication channels including WhatsApp, Telegram, Email, phone calls, and custom links. Each channel can be customized with your specific contact information."
              }
            }
          ]
        }
      ]
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
    toast.success('Code copied!', {
      description: 'Widget code has been copied to clipboard'
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
