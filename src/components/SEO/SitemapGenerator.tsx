
import { supabase } from "@/integrations/supabase/client";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = 'https://hiclient.co';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages with English-optimized priorities
  const staticUrls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/blogs`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}/faq`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      loc: `${baseUrl}/terms-of-service`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.4'
    }
  ];

  // Fetch all published blog posts
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('slug, updated_at, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  // Add blog URLs with high priority for SEO
  const blogUrls: SitemapUrl[] = blogs?.map(blog => ({
    loc: `${baseUrl}/${blog.slug}/`,
    lastmod: (blog.updated_at || blog.created_at).split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  })) || [];

  const allUrls = [...staticUrls, ...blogUrls];

  // Generate XML with proper structure for search engines
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const downloadSitemap = async () => {
  try {
    const sitemapContent = await generateSitemap();
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};
