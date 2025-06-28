
// SEO content generation utilities
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  // Remove HTML tags and get clean text
  const cleanText = content.replace(/<[^>]*>/g, '').trim();
  
  // If content is shorter than max length, return as is
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Find the last complete sentence within the limit
  const truncated = cleanText.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastSentenceEnd > maxLength * 0.6) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  // If no good sentence break, truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
};

export const generateKeywords = (title: string, content: string): string => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
    'his', 'her', 'its', 'our', 'their'
  ]);

  // Combine title and content, clean and split into words
  const text = (title + ' ' + content.replace(/<[^>]*>/g, ''))
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  text.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Get top keywords sorted by frequency
  const keywords = Array.from(wordCount.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  // Add default relevant keywords for floating widgets
  const defaultKeywords = ['floating widget', 'website widget', 'customer support'];
  
  return [...defaultKeywords, ...keywords].join(', ');
};

export const generateStructuredData = (blog: {
  title: string;
  content: string;
  slug: string;
  featured_image?: string | null;
  created_at: string;
  updated_at?: string | null;
}) => {
  const baseUrl = 'https://hiclient.co';
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": generateMetaDescription(blog.content),
    "image": blog.featured_image || `${baseUrl}/logo.png`,
    "author": {
      "@type": "Organization",
      "name": "Hiclient Team",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hiclient",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": 200,
        "height": 200
      },
      "url": baseUrl
    },
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "url": `${baseUrl}/${blog.slug}/`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${blog.slug}/`
    },
    "articleSection": "Technology",
    "keywords": generateKeywords(blog.title, blog.content),
    "wordCount": blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
    "inLanguage": "en-US",
    "genre": ["Technology", "Web Development", "Customer Support"],
    "about": [
      {
        "@type": "Thing",
        "name": "Floating Widget"
      },
      {
        "@type": "Thing", 
        "name": "Website Optimization"
      },
      {
        "@type": "Thing",
        "name": "Customer Support Tools"
      }
    ]
  };
};

export const generateBlogSEOConfig = (blog: {
  title: string;
  content: string;
  slug: string;
  featured_image?: string | null;
  created_at: string;
  updated_at?: string | null;
}) => {
  const baseUrl = 'https://hiclient.co';
  const description = generateMetaDescription(blog.content);
  const keywords = generateKeywords(blog.title, blog.content);
  
  return {
    title: `${blog.title} | Hiclient Blog`,
    description,
    keywords,
    canonicalUrl: `${baseUrl}/${blog.slug}/`,
    ogTitle: `${blog.title} | Hiclient Blog`,
    ogDescription: description,
    ogImage: blog.featured_image || `${baseUrl}/logo.png`,
    ogType: 'article' as const,
    twitterTitle: blog.title,
    twitterDescription: description,
    twitterImage: blog.featured_image || `${baseUrl}/logo.png`,
    structuredData: generateStructuredData(blog)
  };
};
