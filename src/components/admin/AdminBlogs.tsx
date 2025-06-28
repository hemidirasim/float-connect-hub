import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Settings, Trash2, Image } from 'lucide-react';
import { SafeCKEditor } from './SafeCKEditor';
import { ImageUpload } from './ImageUpload';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  featured_image: string | null;
  created_at: string;
  updated_at: string;
}

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Xəta",
        description: "Bloqlar yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      if (!formData.title.trim()) {
        toast({
          title: "Xəta",
          description: "Başlıq sahəsi tələb olunur",
          variant: "destructive",
        });
        return;
      }

      if (!formData.content.trim()) {
        toast({
          title: "Xəta",
          description: "Məzmun sahəsi tələb olunur",
          variant: "destructive",
        });
        return;
      }

      const slug = formData.slug.trim() || generateSlug(formData.title);

      // Check if slug already exists (only when creating new or changing slug)
      const { data: existingBlog } = await supabase
        .from('blogs')
        .select('id')
        .eq('slug', slug)
        .neq('id', editingBlog?.id || '');

      if (existingBlog && existingBlog.length > 0) {
        toast({
          title: "Xəta",
          description: "Bu URL slug artıq mövcuddur",
          variant: "destructive",
        });
        return;
      }

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update({
            title: formData.title.trim(),
            slug,
            excerpt: formData.excerpt.trim() || null,
            content: formData.content,
            featured_image: formData.featured_image.trim() || null,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBlog.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }

        toast({
          title: "Uğurlu",
          description: "Bloq uğurla yeniləndi",
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert({
            title: formData.title.trim(),
            slug,
            excerpt: formData.excerpt.trim() || null,
            content: formData.content,
            featured_image: formData.featured_image.trim() || null,
            status: formData.status
          });

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        toast({
          title: "Uğurlu",
          description: "Yeni bloq uğurla yaradıldı",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast({
        title: "Xəta",
        description: error.message || "Bloq saxlanılarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu bloqu silmək istədiyinizdən əminsiniz?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Bloq silindi",
      });

      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Xəta",
        description: "Bloq silinərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      status: 'draft'
    });
    setEditingBlog(null);
  };

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      featured_image: blog.featured_image || '',
      status: blog.status as 'draft' | 'published'
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            Bloqlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-2 text-gray-400">Yüklənir...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-3 text-white text-xl">
          <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
            <FileText className="w-6 h-6 text-red-400" />
          </div>
          Bloqlar ({blogs.length})
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Bloq
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                {editingBlog ? 'Bloqu Redaktə Et' : 'Yeni Bloq Yarat'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bloq başlığı *
                  </label>
                  <Input
                    placeholder="Bloq başlığı"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL slug
                  </label>
                  <Input
                    placeholder="URL slug (avtomatik yaradılacaq)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  Featured Image
                </label>
                <ImageUpload
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url })}
                  placeholder="Şəkil yükləyin və ya URL daxil edin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Qısa təsvir
                </label>
                <Textarea
                  placeholder="Bloqin qısa təsviri"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Məzmun * - Rich Text Editor
                </label>
                <SafeCKEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Bloq məzmununu yazın..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <Select value={formData.status} onValueChange={(value: 'draft' | 'published') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="draft" className="text-white">Qaralama</SelectItem>
                    <SelectItem value="published" className="text-white">Dərc edilmiş</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  className="border-gray-600 text-white hover:bg-gray-700"
                  disabled={saving}
                >
                  Ləğv et
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={saving}
                >
                  {saving ? 'Saxlanılır...' : (editingBlog ? 'Yenilə' : 'Yarat')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
                <TableHead className="text-gray-300 font-semibold">Başlıq</TableHead>
                <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                <TableHead className="text-gray-300 font-semibold">Featured Image</TableHead>
                <TableHead className="text-gray-300 font-semibold">Yaradılma Tarixi</TableHead>
                <TableHead className="text-gray-300 font-semibold">Yenilənmə Tarixi</TableHead>
                <TableHead className="text-gray-300 font-semibold">Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id} className="border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                  <TableCell className="font-medium text-gray-200">{blog.title}</TableCell>
                  <TableCell>
                    <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                      {blog.status === 'published' ? 'Dərc edilmiş' : 'Qaralama'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {blog.featured_image ? (
                      <img 
                        src={blog.featured_image} 
                        alt="Featured" 
                        className="w-16 h-10 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA2NCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yNCAyMEwyNCAyOEwyOCAyNEwzMiAyOEwzNiAyNEw0MCAyOEw0MCAyMEgyNFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-10 bg-gray-600 rounded flex items-center justify-center">
                        <Image className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">{new Date(blog.created_at).toLocaleDateString('az-AZ')}</TableCell>
                  <TableCell className="text-gray-300">{new Date(blog.updated_at).toLocaleDateString('az-AZ')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(blog)}
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
