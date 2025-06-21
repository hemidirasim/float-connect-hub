
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Upload, Play, X, MessageCircle, Phone, Mail, Send, Heart, Star, Camera, Home, User } from 'lucide-react';

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
  videoHeight?: number;
  videoAlignment?: string;
  customIcon?: string;
  customIconUrl?: string;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoPreviewChange: (checked: boolean) => void;
  onVideoRemove?: () => void;
  onVideoHeightChange?: (height: number) => void;
  onVideoAlignmentChange?: (alignment: string) => void;
  onCustomIconChange?: (icon: string) => void;
  onCustomIconUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  videoUrl,
  useVideoPreview,
  videoHeight = 200,
  videoAlignment = 'center',
  customIcon = 'message-circle',
  customIconUrl,
  onVideoUpload,
  onVideoPreviewChange,
  onVideoRemove,
  onVideoHeightChange,
  onVideoAlignmentChange,
  onCustomIconChange,
  onCustomIconUpload
}) => {
  const hasVideo = video || videoUrl;
  const displayName = video ? video.name : (videoUrl ? 'Mövcud video' : null);

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 text-purple-600">
        <Crown className="w-4 h-4" />
        Upload Video - PRO Feature
      </Label>
      <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center bg-purple-50/50">
        <input
          type="file"
          accept="video/*"
          onChange={onVideoUpload}
          className="hidden"
          id="video-upload"
        />
        <label htmlFor="video-upload" className="cursor-pointer">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-purple-600" />
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          {hasVideo ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-purple-700 font-medium">
                {displayName}
              </p>
              {onVideoRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onVideoRemove();
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-purple-700 font-medium">
              Upload promotional video (max 10MB)
            </p>
          )}
          <p className="text-xs text-purple-600 mt-1">
            PRO feature - Upgrade to add video content
          </p>
        </label>
      </div>

      {/* Video Preview Option */}
      {hasVideo && (
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-purple-600" />
            <Label className="text-sm text-purple-700">Use video as button preview (first 3 seconds)</Label>
          </div>
          <Switch
            checked={useVideoPreview}
            onCheckedChange={onVideoPreviewChange}
          />
        </div>
      )}

      {/* Video Display Settings - Now inside VideoUpload component */}
      {hasVideo && (
        <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
          <Label className="text-base font-medium text-purple-700">Video Display Settings</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="videoHeight">Video Height (px)</Label>
              <Input
                id="videoHeight"
                type="number"
                min="100"
                max="500"
                value={videoHeight}
                onChange={(e) => onVideoHeightChange?.(parseInt(e.target.value) || 200)}
                placeholder="200"
              />
            </div>

            <div className="space-y-2">
              <Label>Video Alignment</Label>
              <Select value={videoAlignment} onValueChange={onVideoAlignmentChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="top">Yuxarı (Top)</SelectItem>
                  <SelectItem value="center">Mərkəz (Center)</SelectItem>
                  <SelectItem value="bottom">Aşağı (Bottom)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Button Icon Settings */}
      <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
        <Label className="text-base font-medium text-blue-700">Button Icon Settings</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Icon</Label>
            <Select value={customIcon} onValueChange={onCustomIconChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Or Upload Custom Icon</Label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-2 text-center bg-blue-50/50">
              <input
                type="file"
                accept="image/*"
                onChange={onCustomIconUpload}
                className="hidden"
                id="icon-upload"
              />
              <label htmlFor="icon-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-1">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">
                    {customIconUrl ? 'Custom Icon' : 'Upload Icon'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
