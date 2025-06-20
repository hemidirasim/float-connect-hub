
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Crown, Upload, Play } from 'lucide-react';

interface VideoUploadProps {
  video: File | null;
  useVideoPreview: boolean;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoPreviewChange: (checked: boolean) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  useVideoPreview,
  onVideoUpload,
  onVideoPreviewChange
}) => {
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
          <p className="text-sm text-purple-700 font-medium">
            {video ? video.name : 'Upload promotional video (max 10MB)'}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            PRO feature - Upgrade to add video content
          </p>
        </label>
      </div>

      {/* Video Preview Option */}
      {video && (
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
    </div>
  );
};
