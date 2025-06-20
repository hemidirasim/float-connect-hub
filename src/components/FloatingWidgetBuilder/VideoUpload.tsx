
import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Crown, Upload, Play, X } from 'lucide-react';

interface VideoUploadProps {
  video: File | null;
  videoUrl?: string; // Existing video URL from database
  useVideoPreview: boolean;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoPreviewChange: (checked: boolean) => void;
  onVideoRemove?: () => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  video,
  videoUrl,
  useVideoPreview,
  onVideoUpload,
  onVideoPreviewChange,
  onVideoRemove
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
    </div>
  );
};
