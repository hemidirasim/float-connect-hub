
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WidgetDimensionsProps {
  widgetWidth: number;
  widgetHeight: number;
  onWidgetWidthChange: (width: number) => void;
  onWidgetHeightChange: (height: number) => void;
}

export const WidgetDimensions: React.FC<WidgetDimensionsProps> = ({
  widgetWidth,
  widgetHeight,
  onWidgetWidthChange,
  onWidgetHeightChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Widget Dimensions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Widget Width */}
        <div className="space-y-2">
          <Label>Widget Width: {widgetWidth}px</Label>
          <Input
            type="range"
            min="300"
            max="600"
            value={widgetWidth}
            onChange={(e) => onWidgetWidthChange(Number(e.target.value))}
          />
        </div>

        {/* Widget Height */}
        <div className="space-y-2">
          <Label>Widget Height: {widgetHeight}px</Label>
          <Input
            type="range"
            min="400"
            max="800"
            value={widgetHeight}
            onChange={(e) => onWidgetHeightChange(Number(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
};
