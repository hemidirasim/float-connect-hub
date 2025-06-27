
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, RefreshCw } from 'lucide-react';

interface UserCredits {
  balance: number;
  total_spent: number;
}

interface CreditBalanceProps {
  userCredits: UserCredits;
  onRefresh: () => void;
  refreshing: boolean;
}

export const CreditBalance: React.FC<CreditBalanceProps> = ({ 
  userCredits, 
  onRefresh, 
  refreshing 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Balance
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={refreshing}
            className="ml-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{userCredits.balance}</div>
            <div className="text-sm text-gray-600">Current credit</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">{userCredits.total_spent}</div>
            <div className="text-sm text-gray-600">Spent credit</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
