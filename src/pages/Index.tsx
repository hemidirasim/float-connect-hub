
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

  const handleCustomIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Custom icon upload triggered');
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.size);

    if (!user) {
      console.log('No user authenticated');
      toast.error('You must be logged in to upload icons', {
        description: 'Please sign in to your account'
      });
      setAuthModalOpen(true);
      return;
    }

    console.log('User authenticated, starting upload');
    try {
      setUploading(true);
      
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `icons/${fileName}`;

      console.log('Uploading to:', filePath);

      const { error } = await supabase.storage
        .from('icons')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload icon', {
          description: error.message
        });
        return;
      }

      console.log('Upload successful, getting public URL');

      // Get public URL
      const { data } = supabase.storage
        .from('icons')
        .getPublicUrl(filePath);

      console.log('Public URL:', data.publicUrl);

      setFormData(prev => ({
        ...prev,
        customIcon: 'custom',
        customIconUrl: data.publicUrl
      }));
      
      toast.success('Custom icon uploaded!', {
        description: 'You can now use it in your widget'
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload icon', {
        description: 'Please try again'
      });
    } finally {
      setUploading(false);
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

  // Check if we should show code preview - only show if we have meaningful generated code
  const shouldShowCodePreview = generatedCode && 
    generatedCode.trim() !== '' && 
    !generatedCode.includes('console.log(\'Widget config\'') && // Don't show fallback code
    editingWidget?.id; // Only show when we have a saved widget

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
          
          {/* Widget Form Section - matching HeroSection style */}
          <section className="relative py-20 overflow-hidden" id="widget-form">
            {/* Modern Background matching HeroSection */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.1),transparent_50%)]"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px] opacity-30"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full opacity-15 animate-pulse delay-1000"></div>

            <div className="relative z-10">
              <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <div className="inline-block mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                    <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ✨ Widget Builder
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Create Your
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                      Floating Widget
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                    Customize your contact widget with multiple channels and optional video messages to boost engagement on your website.
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl">
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
                  </div>
                  
                  {shouldShowCodePreview && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl">
                      <CodePreview
                        generatedCode={generatedCode}
                        copied={copied}
                        onCopy={handleCopyCode}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Blogs Section - matching design */}
          <section className="relative py-20 overflow-hidden">
            {/* Modern Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-20 animate-pulse delay-500"></div>
            <div className="absolute bottom-20 left-10 w-28 h-28 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full opacity-15 animate-pulse delay-700"></div>

            <div className="relative z-10">
              <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <div className="inline-block mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                    <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      📚 Latest Articles
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Learn &
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent block">
                      Get Inspired
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                    Discover tips, tutorials, and best practices for creating effective contact widgets and improving customer engagement.
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto"></div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl">
                  <HomeBlogs />
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section - matching design */}
          <section className="relative py-20 overflow-hidden">
            {/* Modern Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(20,184,166,0.1),transparent_50%)]"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-18 h-18 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-20 animate-pulse delay-300"></div>
            <div className="absolute bottom-20 right-10 w-26 h-26 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full opacity-15 animate-pulse delay-900"></div>

            <div className="relative z-10">
              <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <div className="inline-block mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                    <span className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                      ❓ Frequently Asked Questions
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Got
                    <span className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent block">
                      Questions?
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                    Find answers to common questions about creating and implementing floating contact widgets on your website.
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mx-auto"></div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl">
                  <HomeFAQ />
                </div>
              </div>
            </div>
          </section>
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
