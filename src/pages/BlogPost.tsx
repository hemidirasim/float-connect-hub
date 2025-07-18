
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { generateBlogSEOConfig } from "@/utils/seoGenerator";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  created_at: string;
  updated_at: string | null;
  author_id: string | null;
}

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
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setBlogLoading(false);
    }
  };

  // Generate SEO configuration automatically
  const seoConfig = blog ? generateBlogSEOConfig({
    title: blog.title,
    content: blog.content,
    slug: slug!,
    featured_image: blog.featured_image,
    created_at: blog.created_at,
    updated_at: blog.updated_at
  }) : {
    title: 'Loading... | Hiclient Blog',
    description: 'Loading blog post about floating widgets and customer satisfaction',
    canonicalUrl: `https://hiclient.co/${slug}/`
  };

  const { helmet } = useSEO(seoConfig);

  return (
    <>
      {helmet}

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
              <Button variant="ghost" className="mb-6 hover:bg-blue-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog List
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
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {blog.featured_image && (
                  <div className="w-full h-64 md:h-80 mb-0">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-8 md:p-12">
                  <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{blog.title}</h1>
                    <div className="flex items-center gap-6 text-gray-500 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(blog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Hiclient Team</span>
                      </div>
                    </div>
                  </header>
                  
                  <div 
                    className="prose prose-lg prose-gray max-w-none leading-relaxed
                      prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
                      prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                      prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                      prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-ul:my-6 prose-ol:my-6 prose-ul:space-y-2 prose-ol:space-y-2
                      prose-li:my-2 prose-li:text-gray-700 prose-li:leading-relaxed
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                      prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 
                      prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:rounded-r-lg
                      prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-8
                      prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto
                      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
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
