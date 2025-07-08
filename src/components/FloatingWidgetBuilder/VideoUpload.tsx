
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Trash2, MessageCircle, Info, Play, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VideoSettings } from './VideoSettings';
import { Switch } from "@/components/ui/switch";

interface VideoUploadProps {
  video: File | null;
  videoUrl?: string;
  useVideoPreview: boolean;
  videoHeight: number;
  videoAlignment: string;
  videoObjectFit: string;
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
  onVideoObjectFitChange: (objectFit: string) => void;
  onCustomIconChange: (icon: string) => void;
  onCustomIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonSizeChange: (size: number) => void;
  onPreviewVideoHeightChange: (height: number) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  videoUrl,
  useVideoPreview,
  videoHeight,
  videoAlignment,
  videoObjectFit,
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
  onVideoObjectFitChange,
  onCustomIconChange,
  onCustomIconUpload,
  onButtonSizeChange,
  onPreviewVideoHeightChange
}) => {
  const hasVideo = video || videoUrl;
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const handleVideoPreview = () => {
    setVideoModalOpen(true);
  };

  const getVideoDisplayName = () => {
    if (video && video.name) {
      // Truncate long filenames
      const name = video.name;
      if (name.length > 25) {
        return name.substring(0, 22) + '...';
      }
      return name;
    }
    return 'Video Uploaded';
  };

  const getVideoSrc = () => {
    if (videoUrl) {
      return videoUrl;
    } else if (video) {
      return URL.createObjectURL(video);
    }
    return '';
  };

  // Fixed icon size for the Design & Appearance section - does not change with button size
  const getFixedIconSize = () => {
    return 20; // Fixed size regardless of button size
  };

  // Icon size for the widget button itself - scales with button size
  const getWidgetIconSize = () => {
    return Math.max(20, Math.min(40, Math.round(buttonSize * 0.65)));
  };

  return (
    <div className="space-y-6">
      {/* Button Icon Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Button Icon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Standard Icon Option */}
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="standard-icon"
                name="icon-type"
                checked={customIcon !== 'custom'}
                onChange={() => onCustomIconChange('message')}
                className="w-4 h-4"
              />
              <label htmlFor="standard-icon" className="flex items-center gap-2">
                <MessageCircle 
                  className="text-green-600" 
                  size={getFixedIconSize()}
                />
                <span>Standard Chat Icon</span>
              </label>
            </div>

            {/* Custom Icon Option */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="custom-icon"
                  name="icon-type"
                  checked={customIcon === 'custom'}
                  onChange={() => onCustomIconChange('custom')}
                  className="w-4 h-4"
                />
                <label htmlFor="custom-icon">Custom Icon</label>
              </div>
              
              {customIcon === 'custom' && (
                <div className="ml-6 space-y-2">
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
                    {customIconUrl && (
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
                  {customIconUrl && (
                    <div 
                      className="border rounded flex items-center justify-center bg-gray-50"
                      style={{ 
                        width: `${buttonSize}px`, 
                        height: `${buttonSize}px` 
                      }}
                    >
                      <img 
                        src={customIconUrl} 
                        alt="Custom icon" 
                        className="object-contain"
                        style={{ 
                          width: `${getWidgetIconSize()}px`, 
                          height: `${getWidgetIconSize()}px` 
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Button Size */}
          <div className="space-y-2">
            <Label>Button Size: {buttonSize}px</Label>
            <Input
              type="range"
              min="50"
              max="80"
              value={buttonSize}
              onChange={(e) => onButtonSizeChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500">
              Icon size: {getWidgetIconSize()}px (adjusts automatically)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Promotional Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Video is automatically activated when uploaded. Each video view costs 2 credits.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
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
                  className="flex-1 min-w-0"
                >
                  <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {uploading ? 'Uploading...' : hasVideo ? getVideoDisplayName() : 'Choose Video'}
                  </span>
                </Button>
                
                {hasVideo && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleVideoPreview}
                      title="Preview Video"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onVideoRemove}
                      title="Remove Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {hasVideo && (
              <>
                <VideoSettings
                  videoHeight={videoHeight}
                  videoAlignment={videoAlignment}
                  videoObjectFit={videoObjectFit}
                  onVideoHeightChange={onVideoHeightChange}
                  onVideoAlignmentChange={onVideoAlignmentChange}
                  onVideoObjectFitChange={onVideoObjectFitChange}
                />

                {/* Video Preview Option */}
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Use Video Preview as Button</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Replace the button with a 3-4 second video preview instead of an icon
                      </p>
                    </div>
                    <Switch
                      checked={useVideoPreview}
                      onCheckedChange={onVideoPreviewChange}
                    />
                  </div>

                  {useVideoPreview && (
                    <div className="space-y-2">
                      <Label>Preview Video Height: {previewVideoHeight}px</Label>
                      <Input
                        type="range"
                        min="80"
                        max="150"
                        value={previewVideoHeight}
                        onChange={(e) => onPreviewVideoHeightChange(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        This will show a looping preview of your video as the floating button
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Preview Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center justify-between">
              Video Preview
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVideoModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            {hasVideo && (
              <video
                src={getVideoSrc()}
                controls
                className="w-full max-h-[70vh] rounded-lg"
                autoPlay={false}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
