
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Play, Trash2, MessageCircle, Phone, Mail, Send, Heart, Star, Camera, Home, User } from 'lucide-react';

const iconOptions = [
  { value: 'message-circle', label: 'Message Circle', icon: MessageCircle },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'mail', label: 'Mail', icon: Mail },
  { value: 'send', label: 'Send', icon: Send },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'camera', label: 'Camera', icon: Camera },
  { value: 'home', label: 'Home', icon: Home },
  { value: 'user', label: 'User', icon: User },
];

interface VideoUploadProps {
  video: File | null;
  videoUrl?: string;
  useVideoPreview: boolean;
  videoHeight: number;
  videoAlignment: string;
  customIcon: string;
  customIconUrl: string;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: () => void;
  onVideoPreviewChange: (checked: boolean) => void;
  onVideoHeightChange: (height: number) => void;
  onVideoAlignmentChange: (alignment: string) => void;
  onCustomIconChange: (icon: string) => void;
  onCustomIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Function to truncate filename with extension
const truncateFilename = (filename: string, maxLength: number = 25) => {
  if (filename.length <= maxLength) return filename;
  
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return filename.substring(0, maxLength - 3) + '...';
  }
  
  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex);
  const maxNameLength = maxLength - extension.length - 3; // 3 for '...'
  
  if (name.length <= maxNameLength) return filename;
  
  return name.substring(0, maxNameLength) + '...' + extension;
};

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  videoUrl,
  useVideoPreview,
  videoHeight,
  videoAlignment,
  customIcon,
  customIconUrl,
  onVideoUpload,
  onVideoRemove,
  onVideoPreviewChange,
  onVideoHeightChange,
  onVideoAlignmentChange,
  onCustomIconChange,
  onCustomIconUpload
}) => {
  const hasVideo = video || videoUrl;
  const displayFileName = video ? truncateFilename(video.name) : '';

  return (
    <div className="space-y-6">
      {/* Video Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Video yükləmə</Label>
            <p className="text-sm text-gray-600">Promosyon videosu əlavə edin (max 10MB)</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50/50">
          <input
            type="file"
            accept="video/*"
            onChange={onVideoUpload}
            className="hidden"
            id="video-upload-main"
          />
          
          {hasVideo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Play className="w-6 h-6" />
                <span className="font-medium">Video yükləndi</span>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-gray-900 truncate" title={video?.name}>
                        {displayFileName || 'Video fayl'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {video && `${(video.size / 1024 / 1024).toFixed(1)} MB`}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onVideoRemove}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <label htmlFor="video-upload-main" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Başqa video seçin
                  </span>
                </Button>
              </label>
            </div>
          ) : (
            <label htmlFor="video-upload-main" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">Video yükləyin</p>
              <p className="text-xs text-gray-500">MP4, MOV, AVI (max 10MB)</p>
            </label>
          )}
        </div>
      </div>

      {/* Video Display Settings - Shows when video is uploaded */}
      {hasVideo && (
        <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-blue-800">Video Display Settings</Label>
              <p className="text-sm text-blue-600">Configure how your video appears</p>
            </div>
            <Switch
              checked={useVideoPreview}
              onCheckedChange={onVideoPreviewChange}
            />
          </div>

          {useVideoPreview && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-300">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Video hündürlüyü: {videoHeight}px</Label>
                <Slider
                  value={[videoHeight]}
                  onValueChange={(value) => onVideoHeightChange(value[0])}
                  max={500}
                  min={100}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Video hizalanması</Label>
                <Select value={videoAlignment} onValueChange={onVideoAlignmentChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Yuxarı</SelectItem>
                    <SelectItem value="center">Mərkəz</SelectItem>
                    <SelectItem value="bottom">Aşağı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Button Icon Settings */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Düymə ikonu</Label>
          <p className="text-sm text-gray-600">Widget düyməsinin ikonunu seçin</p>
        </div>

        <div className="space-y-3">
          <Select value={customIcon} onValueChange={onCustomIconChange}>
            <SelectTrigger>
              <SelectValue placeholder="İkon seçin" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Icon</SelectItem>
            </SelectContent>
          </Select>

          {customIcon === 'custom' && (
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={onCustomIconUpload}
                className="hidden"
                id="icon-upload"
              />
              <label htmlFor="icon-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm text-purple-700 font-medium">
                  {customIconUrl ? 'İkon yükləndi - Yenisini seçin' : 'Custom ikon yükləyin'}
                </p>
                <p className="text-xs text-purple-600">PNG, JPG, SVG (max 2MB)</p>
              </label>
              
              {customIconUrl && (
                <div className="mt-3 flex justify-center">
                  <img src={customIconUrl} alt="Custom icon" className="w-8 h-8 rounded" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
