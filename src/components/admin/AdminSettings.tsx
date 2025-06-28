
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Database, Mail, Globe } from 'lucide-react';

export const AdminSettings = () => {
  const [siteTitle, setSiteTitle] = useState('Hiclient');
  const [siteDescription, setSiteDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would save settings to your database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Uğurlu",
        description: "Parametrlər uğurla saxlanıldı",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Xəta",
        description: "Parametrlər saxlanarkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white text-xl">
          <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
            <Settings className="w-6 h-6 text-yellow-400" />
          </div>
          Sistem Parametrləri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Sayt Məlumatları</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteTitle" className="text-gray-300">Sayt Başlığı</Label>
              <Input
                id="siteTitle"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Sayt başlığını daxil edin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription" className="text-gray-300">Sayt Təsviri</Label>
              <Textarea
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Sayt təsvirini daxil edin"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-gray-300">Əlaqə E-poçtu</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="contact@example.com"
              />
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Sistem Statistikaları</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Ümumi İstifadəçilər</span>
                <span className="text-white font-semibold">-</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Aktiv Widgetlər</span>
                <span className="text-white font-semibold">-</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Ümumi Bloq Məqalələri</span>
                <span className="text-white font-semibold">-</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="space-y-4 pt-6 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">E-poçt Parametrləri</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost" className="text-gray-300">SMTP Host</Label>
              <Input
                id="smtpHost"
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="smtp.example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort" className="text-gray-300">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="587"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-700">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saxlanılır...' : 'Parametrləri Saxla'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
