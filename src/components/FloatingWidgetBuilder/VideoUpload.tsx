
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Trash2, MessageCircle, Phone, Mail, Heart, Star, Zap, Gift } from 'lucide-react';

interface VideoUploadProps {
  video: File | null;
  videoUrl?: string;
  useVideoPreview: boolean;
  videoHeight: number;
  videoAlignment: string;
  customIcon: string | null;
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

const iconOptions = [
  { value: 'message', label: 'Message', icon: MessageCircle },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'mail', label: 'Mail', icon: Mail },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'gift', label: 'Gift', icon: Gift },
];

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
  const selectedIconOption = iconOptions.find(opt => opt.value === customIcon);
  const IconComponent = selectedIconOption?.icon || MessageCircle;

  return (
    <div className="space-y-6">
      {/* Button Icon Selection - Now with Select */}
      <Card>
        <CardHeader>
          <CardTitle>Button Icon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Choose Icon</Label>
            <Select value={customIcon || 'message'} onValueChange={onCustomIconChange}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{selectedIconOption?.label || 'Message'}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Icon Upload */}
          <div className="space-y-2">
            <Label className="text-sm">Or upload custom icon</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={onCustomIconUpload}
                className="hidden"
                id="custom-icon-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('custom-icon-upload')?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Custom Icon
              </Button>
              {customIcon === 'custom' && customIconUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onCustomIconChange('message')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {customIcon === 'custom' && customIconUrl && (
              <div className="w-12 h-12 border rounded flex items-center justify-center">
                <img src={customIconUrl} alt="Custom icon" className="w-8 h-8 object-contain" />
              </div>
            )}
          </div>

          {/* Button Size */}
          <div className="space-y-2">
            <Label>Button Size: {buttonSize}px</Label>
            <Input
              type="range"
              min="40"
              max="80"
              value={buttonSize}
              onChange={(e) => onButtonSizeChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Video Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Video Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Video Preview</Label>
              <p className="text-sm text-gray-600">Show promotional video in modal</p>
            </div>
            <Switch
              checked={useVideoPreview}
              onCheckedChange={onVideoPreviewChange}
            />
          </div>

          {useVideoPreview && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              {/* Video Upload */}
              <div className="space-y-2">
                <Label>Upload Video (max 10MB)</Label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={onVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('video-upload')?.click()}
                    disabled={uploading}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : video ? video.name : 'Choose Video'}
                  </Button>
                  {(video || videoUrl) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onVideoRemove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Video Height */}
              <div className="space-y-2">
                <Label>Video Height: {videoHeight}px</Label>
                <Input
                  type="range"
                  min="150"
                  max="400"
                  value={videoHeight}
                  onChange={(e) => onVideoHeightChange(Number(e.target.value))}
                />
              </div>

              {/* Video Alignment */}
              <div className="space-y-2">
                <Label>Video Alignment</Label>
                <Select value={videoAlignment} onValueChange={onVideoAlignmentChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
