
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
  noindex?: boolean;
}

export const useSEO = (props: SEOProps) => {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle = title,
    ogDescription = description,
    ogImage,
    ogType = 'website',
    twitterTitle = title,
    twitterDescription = description,
    twitterImage = ogImage,
    structuredData,
    noindex = false
  } = props;

  useEffect(() => {
    // Update document title
    document.title = title;
  }, [title]);

  return {
    helmet: (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="Hiclient" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={twitterDescription} />
        {twitterImage && <meta name="twitter:image" content={twitterImage} />}
        
        {/* Robots */}
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>
    )
  };
};
