
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Sparkles, Clock } from 'lucide-react';

export const BlogGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateBlog = async () => {
    if (generating) return;

    try {
      setGenerating(true);
      
      toast({
        title: "Blog yaradılır",
        description: "Grok AI istifadə edərək yeni blog yazısı yaradılır...",
      });

      console.log('Calling blog generation function...');

      const { data, error } = await supabase.functions.invoke('generate-blog-with-grok', {
        body: { action: 'generate_weekly_blog' }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      console.log('Blog generation response:', data);

      if (data?.success) {
        toast({
          title: "Uğurlu!",
          description: `Yeni blog yazısı yaradıldı: "${data.blog?.title}"`,
        });
      } else {
        throw new Error(data?.error || 'Blog yaradıla bilmədi');
      }

    } catch (error) {
      console.error('Error generating blog:', error);
      toast({
        title: "Xəta",
        description: `Blog yaradılarkən xəta: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white text-xl">
          <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          AI Blog Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-gray-300">
          <p className="mb-4">
            Grok AI istifadə edərək Hiclient xidmətləri haqqında avtomatik blog yazıları yaradın.
          </p>
          
          <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Avtomatik Cədvəl</span>
            </div>
            <p className="text-sm text-gray-400">
              Hər həftə bazar ertəsi günü səhər saat 9:00-da avtomatik blog yaradılır
            </p>
          </div>
        </div>

        <Button 
          onClick={handleGenerateBlog}
          disabled={generating}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Blog Yaradılır...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Test Bloq Yarat
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
