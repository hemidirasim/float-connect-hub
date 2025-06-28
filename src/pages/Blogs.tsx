import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from "@/hooks/useSEO";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  created_at: string;
  author_id: string | null;
}

const Blogs = () => {
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setBlogsLoading(false);
    }
  };

  // SEO configuration
  const seoConfig = {
    title: 'Bloq - Hiclient | Widget və Müştəri Məmnuniyyəti Məqalələri',
    description: 'Floating widget-lər, müştəri məmnuniyyəti və sayt optimizasiyası haqqında faydalı məqalələr. Biznesinizi inkişaf etdirin və müştərilərinizlə əlaqəni gücləndirin.',
    keywords: 'floating widget məqalələri, müştəri məmnuniyyəti, sayt optimizasiyası, whatsapp widget, telegram widget, video popup, müştəri dəstəyi',
    canonicalUrl: 'https://hiclient.co/blogs',
    ogTitle: 'Bloq - Hiclient | Widget və Müştəri Məmnuniyyəti Məqalələri',
    ogDescription: 'Floating widget-lər, müştəri məmnuniyyəti və sayt optimizasiyası haqqında faydalı məqalələr.',
    ogType: 'website',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Hiclient Blog",
      "description": "Floating widget-lər və müştəri məmnuniyyəti haqqında məqalələr",
      "url": "https://hiclient.co/blogs",
      "publisher": {
        "@type": "Organization",
        "name": "Hiclient",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hiclient.co/logo.png"
        }
      },
      "blogPost": blogs.map(blog => ({
        "@type": "BlogPosting",
        "headline": blog.title,
        "url": `https://hiclient.co/${blog.slug}/`,
        "datePublished": blog.created_at,
        "description": blog.excerpt
      }))
    }
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Bizim Bloq</h1>
              <p className="text-xl text-gray-600">
                Müştəri məmnuniyyəti üçün məsləhətlər, anlayışlar və ən yaxşı təcrübələr kəşf edin
              </p>
            </div>

            {blogsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link key={blog.id} to={`/${blog.slug}/`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      {blog.featured_image ? (
                        <div className="h-48 overflow-hidden rounded-t-lg">
                          <img 
                            src={blog.featured_image} 
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-purple-600');
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                          <Image className="w-12 h-12 text-white/80" />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(blog.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Hiclient Team
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!blogsLoading && blogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Hələ heç bir bloq məqaləsi yoxdur.</p>
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

export default Blogs;
