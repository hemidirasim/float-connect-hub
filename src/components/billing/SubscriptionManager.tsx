
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

interface SubscriptionManagerProps {
  onManageSubscription: () => void;
  managingSubscription: boolean;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  onManageSubscription,
  managingSubscription
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium">Manage Subscription</h4>
            <p className="text-sm text-gray-600">Cancel, update payment method, or view billing history</p>
          </div>
          <Button
            onClick={onManageSubscription}
            disabled={managingSubscription}
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            {managingSubscription ? 'Opening...' : 'Manage'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
