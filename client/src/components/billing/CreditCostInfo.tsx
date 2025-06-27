
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from 'lucide-react';

export const CreditCostInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-gray-600" />
          Credit cost
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">Standard widget display</div>
              <div className="text-sm text-gray-600">Non-video widgets</div>
            </div>
            <Badge variant="outline">1 credit</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <div>
              <div className="font-medium">Video widget display</div>
              <div className="text-sm text-gray-600">Widgets with video</div>
            </div>
            <Badge variant="outline" className="text-purple-600">2 credits</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
