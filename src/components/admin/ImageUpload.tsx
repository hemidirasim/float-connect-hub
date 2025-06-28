
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  placeholder = "Şəkil yükləyin və ya URL daxil edin" 
}) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Xəta",
        description: "Yalnız şəkil faylları yüklənə bilər",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Xəta",
        description: "Şəkil ölçüsü 5MB-dan çox ola bilməz",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
      setUrlInput(data.publicUrl);
      
      toast({
        title: "Uğurlu",
        description: "Şəkil yükləndi",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Xəta",
        description: error.message || "Şəkil yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange(url);
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white flex-1"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="border-gray-600 text-white hover:bg-gray-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Yüklənir...' : 'Yüklə'}
        </Button>
      </div>

      {value && (
        <div className="mt-4">
          <img 
            src={value} 
            alt="Önizləmə" 
            className="max-w-xs h-32 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};
