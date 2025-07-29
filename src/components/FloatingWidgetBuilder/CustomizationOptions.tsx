
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CustomizationOptionsProps {
  buttonColor: string;
  position: 'left' | 'right';
  tooltipText: string;
  tooltipDisplay: 'hover' | 'always' | 'never';
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right';
  onButtonColorChange: (color: string) => void;
  onPositionChange: (position: string) => void;
  onTooltipTextChange: (text: string) => void;
  onTooltipDisplayChange: (display: 'hover' | 'always' | 'never') => void;
  onTooltipPositionChange: (position: 'top' | 'bottom' | 'left' | 'right') => void;
}

export const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({
  buttonColor,
  position,
  tooltipText,
  tooltipDisplay,
  tooltipPosition,
  onButtonColorChange,
  onPositionChange,
  onTooltipTextChange,
  onTooltipDisplayChange,
  onTooltipPositionChange
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
        <Label htmlFor="tooltipText">Tooltip Text</Label>
        <Input
          id="tooltipText"
          placeholder="Bizimlə əlaqə saxlayın"
          value={tooltipText}
          onChange={(e) => onTooltipTextChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tooltip Display</Label>
          <Select value={tooltipDisplay} onValueChange={onTooltipDisplayChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="hover">On Hover</SelectItem>
              <SelectItem value="always">Always Show</SelectItem>
              <SelectItem value="never">Never Show</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tooltip Position</Label>
          <Select value={tooltipPosition} onValueChange={onTooltipPositionChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
