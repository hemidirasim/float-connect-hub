
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Trash2, MessageCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  videoUrl,
  videoHeight,
  videoAlignment,
  customIcon,
  customIconUrl,
  buttonSize,
  uploading = false,
  onVideoUpload,
  onVideoRemove,
  onVideoHeightChange,
  onVideoAlignmentChange,
  onCustomIconChange,
  onCustomIconUpload,
  onButtonSizeChange
}) => {
  const hasVideo = video || videoUrl;

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
                <MessageCircle className="w-5 h-5 text-green-600" />
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
                    <div className="w-12 h-12 border rounded flex items-center justify-center bg-gray-50">
                      <img src={customIconUrl} alt="Custom icon" className="w-8 h-8 object-contain" />
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
              Video yüklənən kimi avtomatik aktivləşir. Hər video baxışı 2 credit aparır.
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
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : video ? video.name : 'Choose Video'}
                </Button>
                {hasVideo && (
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

            {hasVideo && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
