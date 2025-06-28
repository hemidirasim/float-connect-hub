
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

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  created_at: string;
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

  return (
    <>
      <Helmet>
        <title>{blog ? `${blog.title} | Hiclient Bloq` : 'Yüklənir... | Hiclient Bloq'}</title>
        <meta name="description" content={blog ? blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : 'Floating widget və müştəri məmnuniyyəti haqqında məqalə'} />
        <link rel="canonical" href={`https://hiclient.co/${slug}/`} />
        
        {blog && (
          <>
            <meta property="og:title" content={`${blog.title} | Hiclient Bloq`} />
            <meta property="og:description" content={blog.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'} />
            <meta property="og:url" content={`https://hiclient.co/${slug}/`} />
            <meta property="og:type" content="article" />
            {blog.featured_image && <meta property="og:image" content={blog.featured_image} />}
            <meta property="article:published_time" content={blog.created_at} />
            <meta property="article:author" content="Hiclient Team" />
            
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": blog.title,
                "description": blog.content.replace(/<[^>]*>/g, '').substring(0, 160),
                "image": blog.featured_image || undefined,
                "author": {
                  "@type": "Organization",
                  "name": "Hiclient Team"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Hiclient",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://hiclient.co/logo.png"
                  }
                },
                "datePublished": blog.created_at,
                "dateModified": blog.created_at,
                "url": `https://hiclient.co/${slug}/`,
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://hiclient.co/${slug}/`
                }
              })}
            </script>
          </>
        )}
      </Helmet>

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
                Bloq siyahısına qayıt
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
                        <span>{new Date(blog.created_at).toLocaleDateString('az-AZ', {
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
                    className="prose prose-lg prose-gray max-w-none 
                      prose-headings:text-gray-900 prose-headings:font-bold 
                      prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
                      prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-6
                      prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-4
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-ul:my-4 prose-ol:my-4
                      prose-li:my-1 prose-li:text-gray-700
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                      prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 
                      prose-blockquote:italic prose-blockquote:my-6
                      prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                      prose-img:rounded-lg prose-img:shadow-md prose-img:my-6"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>
              </article>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Bloq məqaləsi tapılmadı.</p>
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
