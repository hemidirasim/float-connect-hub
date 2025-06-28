
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/useSEO";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  created_at: string;
  updated_at: string;
}

const Blogs = () => {
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // SEO Configuration for Blogs page
  const seoConfig = {
    title: 'Blog | Hiclient - Floating Widget & Customer Support Insights',
    description: 'Discover expert insights on floating widgets, customer support tools, website optimization, and user engagement strategies. Learn how to improve your website\'s conversion rates.',
    keywords: 'floating widget, customer support, website optimization, user engagement, conversion rate, live chat, contact forms, website tools, customer satisfaction',
    canonicalUrl: 'https://hiclient.co/blogs',
    ogTitle: 'Hiclient Blog - Expert Insights on Website Widgets & Customer Support',
    ogDescription: 'Learn from our experts about floating widgets, customer support tools, and website optimization strategies that boost engagement and conversions.',
    ogImage: 'https://hiclient.co/logo.png',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Hiclient Blog",
      "description": "Expert insights on floating widgets, customer support tools, and website optimization",
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
        "dateModified": blog.updated_at,
        "description": blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 160)
      }))
    }
  };

  const { helmet } = useSEO(seoConfig);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
      setFilteredBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setBlogsLoading(false);
    }
  };

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
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Hiclient Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Expert insights on floating widgets, customer support tools, and website optimization strategies to boost your business engagement.
              </p>
              
              {/* Search */}
              <div className="max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Blog Posts */}
            {blogsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                  <article key={blog.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    {blog.featured_image && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={blog.featured_image} 
                          alt={blog.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <header className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-blue-600 transition-colors">
                          <Link to={`/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h2>
                        
                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(blog.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Hiclient Team</span>
                          </div>
                        </div>
                      </header>
                      
                      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                      </p>
                      
                      <Link to={`/${blog.slug}`}>
                        <Button variant="outline" className="w-full group hover:bg-blue-600 hover:text-white transition-colors">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No articles found matching your search.' : 'No blog posts available yet.'}
                </p>
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
