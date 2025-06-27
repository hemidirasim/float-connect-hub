
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  author_id: string | null;
}

// Function to generate SEO-friendly URL slug from title
const generateSeoSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [blogLoading, setBlogLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      // First try to find by existing slug
      let { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      // If not found by slug, try to find by generated SEO slug from title
      if (error && error.code === 'PGRST116') {
        const { data: allBlogs, error: allBlogsError } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published');

        if (!allBlogsError && allBlogs) {
          const matchingBlog = allBlogs.find(blog => 
            generateSeoSlug(blog.title) === slug?.replace(/\/$/, '') // Remove trailing slash
          );
          
          if (matchingBlog) {
            data = matchingBlog;
            error = null;
          }
        }
      }

      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setBlogLoading(false);
    }
  };

  const currentUrl = `https://hiclient.co/${slug}/`;

  return (
    <>
      {blog && (
        <Helmet>
          <title>{blog.title} | Hiclient Blog</title>
          <meta name="description" content={blog.excerpt || `${blog.content.replace(/<[^>]*>/g, '').substring(0, 160)}...`} />
          <meta name="keywords" content="website widget, customer engagement, floating widget, video widget, whatsapp widget, website optimization" />
          <link rel="canonical" href={currentUrl} />
          
          <meta property="og:title" content={`${blog.title} | Hiclient Blog`} />
          <meta property="og:description" content={blog.excerpt || `${blog.content.replace(/<[^>]*>/g, '').substring(0, 160)}...`} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={blog.created_at} />
          <meta property="article:author" content="Hiclient Team" />
          
          <meta name="twitter:title" content={blog.title} />
          <meta name="twitter:description" content={blog.excerpt || `${blog.content.replace(/<[^>]*>/g, '').substring(0, 160)}...`} />
          <meta name="twitter:card" content="summary_large_image" />

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": blog.title,
              "description": blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 160),
              "url": currentUrl,
              "datePublished": blog.created_at,
              "author": {
                "@type": "Organization",
                "name": "Hiclient Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Hiclient",
                "url": "https://hiclient.co"
              }
            })}
          </script>
        </Helmet>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header 
          user={user}
          loading={loading}
          onSignOut={handleSignOut}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Link to="/blogs">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            {blogLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : blog ? (
              <article className="bg-white rounded-lg shadow-sm p-8">
                <header className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Hiclient Team
                    </div>
                  </div>
                </header>
                
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </article>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Blog post not found.</p>
              </div>
            )}
          </div>
        </div>

        <Footer />
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    </>
  );
};

export default BlogPost;
