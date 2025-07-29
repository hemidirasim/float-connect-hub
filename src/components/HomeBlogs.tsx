
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  created_at: string;
}

export const HomeBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 mb-6 bg-gray-50 rounded-full border shadow-sm">
                <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Knowledge Hub
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Latest Blog
                <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Posts
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">Stay updated with our latest insights and tips</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="p-6">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-400/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400/5 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 mb-6 bg-gray-50 rounded-full border shadow-sm">
              <BookOpen className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Knowledge Hub
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Latest Blog
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Posts
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">Stay updated with our latest insights and tips</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {blogs.map((blog, index) => (
              <Link key={blog.id} to={`/${blog.slug}/`} className="group">
                <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 relative z-10">
                    <p className="text-gray-600 leading-relaxed mb-6">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>5 min read</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:text-green-700 transition-colors duration-300">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/blogs">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                View All Posts <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
