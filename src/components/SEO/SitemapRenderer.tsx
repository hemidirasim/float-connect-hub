
import React, { useEffect } from 'react';
import { generateSitemap } from './SitemapGenerator';

export const SitemapRenderer = () => {
  useEffect(() => {
    const serveSitemap = async () => {
      try {
        const sitemapContent = await generateSitemap();
        
        // Clear the current document and serve XML
        document.open();
        document.write(sitemapContent);
        document.close();
        
        // Set content type
        if (document.contentType) {
          document.contentType = 'application/xml';
        }
      } catch (error) {
        console.error('Error serving sitemap:', error);
        document.open();
        document.write(`<?xml version="1.0" encoding="UTF-8"?>
<error>
  <message>Error generating sitemap</message>
</error>`);
        document.close();
      }
    };

    serveSitemap();
  }, []);

  return null;
};
