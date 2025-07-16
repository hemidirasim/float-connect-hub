
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, FileText, Clock, Play, Pause } from 'lucide-react';
import { generateSitemap, downloadSitemap } from '@/components/SEO/SitemapGenerator';
import { downloadRobotsTxt } from '@/components/SEO/RobotsGenerator';
import { supabase } from "@/integrations/supabase/client";

export const AdminSEO = () => {
  const [generating, setGenerating] = useState(false);
  const [cronStatus, setCronStatus] = useState<'running' | 'stopped' | 'unknown'>('unknown');
  const { toast } = useToast();

  const handleGenerateSitemap = async () => {
    setGenerating(true);
    try {
      await downloadSitemap();
      toast({
        title: "Uğurlu",
        description: "Sitemap uğurla yaradıldı və yükləndi",
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Xəta",
        description: "Sitemap yaradılarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateRobots = () => {
    try {
      downloadRobotsTxt();
      toast({
        title: "Uğurlu",
        description: "Robots.txt faylı uğurla yaradıldı və yükləndi",
      });
    } catch (error) {
      console.error('Error generating robots.txt:', error);
      toast({
        title: "Xəta",
        description: "Robots.txt yaradılarkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const handleSetupDailyCron = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('setup-daily-blog-cron');
      
      if (error) throw error;
      
      if (data?.success) {
        setCronStatus('running');
        toast({
          title: "Uğurlu",
          description: "Günlük blog avtomatik paylaşımı aktivləşdirildi",
        });
      }
    } catch (error) {
      console.error('Error setting up cron:', error);
      toast({
        title: "Xəta",
        description: "Cron job qurularkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const handleStopDailyCron = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stop-daily-blog-cron');
      
      if (error) throw error;
      
      if (data?.success) {
        setCronStatus('stopped');
        toast({
          title: "Uğurlu",
          description: "Günlük blog avtomatik paylaşımı dayandırıldı",
        });
      }
    } catch (error) {
      console.error('Error stopping cron:', error);
      toast({
        title: "Xəta",
        description: "Cron job dayandırılarkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white text-xl">
          <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
            <Search className="w-6 h-6 text-green-400" />
          </div>
          SEO və Avtomatlaşdırma İdarəetməsi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Blog Automation */}
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Günlük Blog Avtomatlaşdırması</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Hər gün səhər saat 9:00-da avtomatik blog yazısı yaradılması
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleSetupDailyCron}
              className="bg-green-600 hover:bg-green-700"
              disabled={cronStatus === 'running'}
            >
              <Play className="w-4 h-4 mr-2" />
              Aktivləşdir
            </Button>
            <Button
              onClick={handleStopDailyCron}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600/20"
              disabled={cronStatus === 'stopped'}
            >
              <Pause className="w-4 h-4 mr-2" />
              Dayandır
            </Button>
          </div>
          {cronStatus !== 'unknown' && (
            <div className="mt-2 text-sm">
              Status: <span className={cronStatus === 'running' ? 'text-green-400' : 'text-red-400'}>
                {cronStatus === 'running' ? 'Aktiv' : 'Dayandırılıb'}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sitemap Generator */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Sitemap Yaradıcısı</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Bütün səhifələr və blog məqalələrini əhatə edən XML sitemap yaradın
            </p>
            <Button
              onClick={handleGenerateSitemap}
              disabled={generating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {generating ? 'Yaradılır...' : 'Sitemap Yarat və Yüklə'}
            </Button>
          </div>

          {/* Robots.txt Generator */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Robots.txt Yaradıcısı</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Axtarış motorları üçün robots.txt faylı yaradın
            </p>
            <Button
              onClick={handleGenerateRobots}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Robots.txt Yarat və Yüklə
            </Button>
          </div>
        </div>

        {/* SEO Best Practices */}
        <div className="mt-8 p-6 bg-gray-700/50 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">SEO Təlimatları</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Hər blog məqaləsi üçün unikal və təsviri başlıq yazın</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Meta təsvirlər 150-160 simvol arasında olmalıdır</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Hər məqalə üçün featured image əlavə edin</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>URL slug-lar qısa və məna daşıyan olmalıdır</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Məzmunda H1, H2, H3 başlıqlarından istifadə edin</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Günlük avtomatik blog paylaşımı aktivdir</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
