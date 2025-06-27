
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
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

  return (
    <>
      <Helmet>
        <title>Blog - Latest Tips & Guides for Website Widgets | Hiclient</title>
        <meta name="description" content="Discover expert tips, guides, and best practices for creating effective floating widgets, improving customer engagement, and boosting website conversions." />
        <meta name="keywords" content="website widget tips, customer engagement guides, floating widget tutorials, video widget best practices, website optimization" />
        <link rel="canonical" href="https://hiclient.co/blogs" />
        
        <meta property="og:title" content="Blog - Latest Tips & Guides for Website Widgets | Hiclient" />
        <meta property="og:description" content="Discover expert tips, guides, and best practices for creating effective floating widgets, improving customer engagement, and boosting website conversions." />
        <meta property="og:url" content="https://hiclient.co/blogs" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:title" content="Blog - Latest Tips & Guides for Website Widgets | Hiclient" />
        <meta name="twitter:description" content="Discover expert tips, guides, and best practices for creating effective floating widgets, improving customer engagement, and boosting website conversions." />
      </Helmet>

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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
              <p className="text-xl text-gray-600">
                Discover tips, insights, and best practices for customer engagement
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
                {blogs.map((blog) => {
                  const seoSlug = generateSeoSlug(blog.title);
                  return (
                    <Link key={blog.id} to={`/${seoSlug}/`}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        {blog.featured_image && (
                          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
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
                  );
                })}
              </div>
            )}

            {!blogsLoading && blogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts available yet.</p>
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
