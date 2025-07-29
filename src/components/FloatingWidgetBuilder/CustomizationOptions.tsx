

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CustomizationOptionsProps {
  buttonColor: string;
  position: string;
  greetingMessage: string;
  onButtonColorChange: (color: string) => void;
  onPositionChange: (position: string) => void;
  onGreetingMessageChange: (message: string) => void;
}

export const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({
  buttonColor,
  position,
  greetingMessage,
  onButtonColorChange,
  onPositionChange,
  onGreetingMessageChange
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
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="greetingMessage">Modal Greeting Message</Label>
        <Textarea
          id="greetingMessage"
          placeholder="Salam! Sizə necə kömək edə bilərik?"
          value={greetingMessage}
          onChange={(e) => onGreetingMessageChange(e.target.value)}
          rows={3}
          maxLength={150}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {greetingMessage.length < 10 ? (
              <span className="text-red-500">Minimum 10 characters required</span>
            ) : (
              <span className="text-green-600">✓ Enough</span>
            )}
          </span>
          <span>{greetingMessage.length}/150</span>
        </div>
      </div>
    </>
  );
};

