
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoSettingsProps {
  videoHeight: number;
  videoAlignment: string;
  videoObjectFit: string;
  onVideoHeightChange: (height: number) => void;
  onVideoAlignmentChange: (alignment: string) => void;
  onVideoObjectFitChange: (objectFit: string) => void;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({
  videoHeight,
  videoAlignment,
  videoObjectFit,
  onVideoHeightChange,
  onVideoAlignmentChange,
  onVideoObjectFitChange
}) => {
  return (
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

      {/* Video Object Fit */}
      <div className="space-y-2">
        <Label>Video Object Fit</Label>
        <Select value={videoObjectFit} onValueChange={onVideoObjectFitChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
