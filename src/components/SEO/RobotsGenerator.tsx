
export const generateRobotsTxt = (): string => {
  const baseUrl = 'https://hiclient.co';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /dashboard/private/
Disallow: /*.json$

# Allow important files
Allow: /sitemap.xml
Allow: /robots.txt`;
};

export const downloadRobotsTxt = () => {
  try {
    const robotsContent = generateRobotsTxt();
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
  }
};
