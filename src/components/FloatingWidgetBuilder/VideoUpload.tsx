
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Play, Trash2, MessageCircle, Phone, Mail, Send, Heart, Star, Camera, Home, User, Loader2 } from 'lucide-react';

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
  buttonSize: number;
  previewVideoHeight: number;
  uploading?: boolean;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: () => void;
  onVideoPreviewChange: (checked: boolean) => void;
  onVideoHeightChange: (height: number) => void;
  onVideoAlignmentChange: (alignment: string) => void;
  onCustomIconChange: (icon: string) => void;
  onCustomIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonSizeChange: (size: number) => void;
  onPreviewVideoHeightChange: (height: number) => void;
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
  buttonSize,
  previewVideoHeight,
  uploading = false,
  onVideoUpload,
  onVideoRemove,
  onVideoPreviewChange,
  onVideoHeightChange,
  onVideoAlignmentChange,
  onCustomIconChange,
  onCustomIconUpload,
  onButtonSizeChange,
  onPreviewVideoHeightChange
}) => {
  const hasVideo = video || videoUrl;
  const displayFileName = video ? truncateFilename(video.name) : (videoUrl ? 'Uploaded video' : '');

  return (
    <div className="space-y-6">
      {/* Video Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Video upload</Label>
            <p className="text-sm text-gray-600">Add a promo video (max 10MB)</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50/50">
          <input
            type="file"
            accept="video/*"
            onChange={onVideoUpload}
            className="hidden"
            id="video-upload-main"
            disabled={uploading}
          />
          
          {hasVideo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Play className="w-6 h-6" />
                <span className="font-medium">Video has been uploaded</span>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-gray-900 truncate" title={video?.name || 'Uploaded video'}>
                        {displayFileName}
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
                    disabled={uploading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <label htmlFor="video-upload-main" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild disabled={uploading}>
                  <span>
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose another video
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          ) : (
            <label htmlFor="video-upload-main" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 mb-2">
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                {uploading ? 'Uploading video...' : 'Video yükləyin'}
              </p>
              <p className="text-xs text-gray-500">MP4, MOV, AVI (max 10MB)</p>
            </label>
          )}
        </div>
      </div>

      {/* Video Display Settings - Always visible when video exists */}
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

          {/* Always show video settings regardless of toggle */}
          <div className="space-y-4 pl-4 border-l-2 border-blue-300">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Modal video height: {videoHeight}px</Label>
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
              <Label className="text-sm font-medium">Preview video height: {previewVideoHeight}px</Label>
              <Slider
                value={[previewVideoHeight]}
                onValueChange={(value) => onPreviewVideoHeightChange(value[0])}
                max={300}
                min={50}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Video alignment</Label>
              <Select value={videoAlignment} onValueChange={onVideoAlignmentChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Button Size Settings */}
      <div className="space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-200">
        <div>
          <Label className="text-base font-medium text-green-800">Button Size Settings</Label>
          <p className="text-sm text-green-600">Adjust the size of your floating button</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Button size: {buttonSize}px</Label>
          <Slider
            value={[buttonSize]}
            onValueChange={(value) => onButtonSizeChange(value[0])}
            max={100}
            min={40}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Button Icon Settings */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Button icon</Label>
          <p className="text-sm text-gray-600">Choose widget icon</p>
        </div>

        <div className="space-y-3">
          <Select value={customIcon || 'message-circle'} onValueChange={onCustomIconChange}>
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
                  {customIconUrl ? 'Icon uploaded - Choose new' : 'Upload custom icon'}
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
