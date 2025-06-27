
import { WidgetCreator } from "@/components/WidgetCreator";
import { HomeBlogs } from "@/components/HomeBlogs";
import { HomeFAQ } from "@/components/HomeFAQ";
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const handleSave = () => {
    // Handle save action - could redirect to dashboard or show success message
    console.log('Widget saved');
  };

  const handleCancel = () => {
    // Handle cancel action - could reset form or show confirmation
    console.log('Widget creation cancelled');
  };

  return (
    <>
      <Helmet>
        <title>Hiclient - Create Interactive Floating Widgets for Your Website | Customer Engagement Platform</title>
        <meta name="description" content="Create professional floating widgets for your website with video integration, multi-channel support (WhatsApp, Telegram, Email). Easy setup, no coding required. Boost customer engagement and conversions." />
        <meta name="keywords" content="floating widget, website widget, customer engagement, whatsapp widget, telegram widget, video widget, website popup, contact widget, customer support widget, live chat alternative" />
        <link rel="canonical" href="https://hiclient.co/" />
        
        <meta property="og:title" content="Hiclient - Create Interactive Floating Widgets for Your Website" />
        <meta property="og:description" content="Create professional floating widgets for your website with video integration, multi-channel support (WhatsApp, Telegram, Email). Easy setup, no coding required." />
        <meta property="og:url" content="https://hiclient.co/" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:title" content="Hiclient - Create Interactive Floating Widgets for Your Website" />
        <meta name="twitter:description" content="Create professional floating widgets for your website with video integration, multi-channel support (WhatsApp, Telegram, Email). Easy setup, no coding required." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hiclient",
            "url": "https://hiclient.co",
            "description": "Create professional floating widgets for your website with video integration and multi-channel support",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://hiclient.co/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen">
        <WidgetCreator onSave={handleSave} onCancel={handleCancel} />
        <HomeBlogs />
        <HomeFAQ />
      </div>
    </>
  );
};

export default Index;
