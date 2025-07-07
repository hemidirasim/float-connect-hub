
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Widget } from './types';

interface WidgetSelectorProps {
  widgets: Widget[];
  selectedWidget: string;
  onWidgetChange: (widgetId: string) => void;
}

export const WidgetSelector: React.FC<WidgetSelectorProps> = ({
  widgets,
  selectedWidget,
  onWidgetChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Sayt Seçimi</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedWidget} onValueChange={onWidgetChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sayt seçin" />
          </SelectTrigger>
          <SelectContent>
            {widgets.map((widget) => (
              <SelectItem key={widget.id} value={widget.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{widget.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {widget.website_url}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
