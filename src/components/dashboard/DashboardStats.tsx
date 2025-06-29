
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Globe, Eye, BarChart3 } from 'lucide-react';

interface Widget {
  id: string;
  is_active: boolean;
  total_views: number;
}

interface UserCredits {
  balance: number;
  total_spent: number;
}

interface DashboardStatsProps {
  userCredits: UserCredits;
  widgets: Widget[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ userCredits, widgets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className="text-2xl font-bold text-green-600">{userCredits.balance}</p>
              <p className="text-xs text-gray-500">credits</p>
            </div>
            <Coins className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Websites</p>
              <p className="text-2xl font-bold text-blue-600">{widgets.length}</p>
              <p className="text-xs text-gray-500">active: {widgets.filter(w => w.is_active).length}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">
                {widgets.reduce((sum, w) => sum + (w.total_views || 0), 0)}
              </p>
              <p className="text-xs text-gray-500">all websites</p>
            </div>
            <Eye className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Spent</p>
              <p className="text-2xl font-bold text-orange-600">{userCredits.total_spent}</p>
              <p className="text-xs text-gray-500">credits</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
