
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomizationOptionsProps {
  buttonColor: string;
  position: string;
  tooltip: string;
  videoHeight?: number;
  videoAlignment?: string;
  hasVideo?: boolean;
  onButtonColorChange: (color: string) => void;
  onPositionChange: (position: string) => void;
  onTooltipChange: (tooltip: string) => void;
  onVideoHeightChange?: (height: number) => void;
  onVideoAlignmentChange?: (alignment: string) => void;
}

export const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({
  buttonColor,
  position,
  tooltip,
  videoHeight = 200,
  videoAlignment = 'center',
  hasVideo = false,
  onButtonColorChange,
  onPositionChange,
  onTooltipChange,
  onVideoHeightChange,
  onVideoAlignmentChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Button Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="color"
              value={buttonColor}
              onChange={(e) => onButtonColorChange(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300"
            />
            <Input
              value={buttonColor}
              onChange={(e) => onButtonColorChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Button Position</Label>
          <Select value={position} onValueChange={onPositionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tooltip">Call-to-Action Tooltip</Label>
        <Input
          id="tooltip"
          placeholder="Get in touch with us!"
          value={tooltip}
          onChange={(e) => onTooltipChange(e.target.value)}
        />
      </div>

      {/* Video Display Settings */}
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
    </>
  );
};
