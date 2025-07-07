
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportTickets } from "@/components/SupportTickets";
import { ProfileSettings } from "@/components/ProfileSettings";
import { BillingSection } from "@/components/BillingSection";
import { TransactionHistory } from "@/components/TransactionHistory";
import { WebsitesList } from "./WebsitesList";
import { LiveChatManager } from "./LiveChatManager";

interface Widget {
  id: string;
  name: string;
  website_url: string;
  button_color: string;
  position: string;
  tooltip: string;
  video_enabled: boolean;
  video_url: string;
  button_style: string;
  custom_icon_url: string;
  show_on_mobile: boolean;
  show_on_desktop: boolean;
  channels: any[];
  total_views: number;
  is_active: boolean;
  created_at: string;
}

interface UserCredits {
  balance: number;
  total_spent: number;
}

interface DashboardTabsProps {
  widgets: Widget[];
  userCredits: UserCredits;
  onRefreshWidgets: () => void;
  onRefreshCredits: () => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  widgets, 
  userCredits, 
  onRefreshWidgets, 
  onRefreshCredits 
}) => {
  return (
    <Tabs defaultValue="widgets" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="widgets">My Websites</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>

      <TabsContent value="widgets" className="space-y-6">
        <WebsitesList widgets={widgets} onRefresh={onRefreshWidgets} />
      </TabsContent>

      <TabsContent value="billing">
        <div className="space-y-6">
          <BillingSection userCredits={userCredits} onCreditsUpdate={onRefreshCredits} />
          <TransactionHistory />
        </div>
      </TabsContent>

      <TabsContent value="profile">
        <ProfileSettings />
      </TabsContent>

      <TabsContent value="support">
        <SupportTickets />
      </TabsContent>
    </Tabs>
  );
};
