
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';
import { Channel, FormData } from './types';
import { TemplatePreview } from './TemplatePreview';

interface LivePreviewProps {
  showWidget: boolean;
  formData: FormData;
  channels: Channel[];
  videoModalOpen: boolean;
  onVideoModalOpenChange: (open: boolean) => void;
  editingWidget?: any;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  showWidget,
  formData,
  channels,
  videoModalOpen,
  onVideoModalOpenChange,
  editingWidget
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          Live Preview
        </CardTitle>
        <CardDescription>
          Real-time preview of your floating widget using template system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TemplatePreview
          showWidget={showWidget}
          formData={formData}
          channels={channels}
          editingWidget={editingWidget}
        />
      </CardContent>
    </Card>
  );
};
