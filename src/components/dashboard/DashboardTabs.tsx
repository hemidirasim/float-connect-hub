
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportTickets } from "@/components/SupportTickets";
import { ProfileSettings } from "@/components/ProfileSettings";
import { BillingSection } from "@/components/BillingSection";
import { TransactionHistory } from "@/components/TransactionHistory";
import { WebsitesList } from "./WebsitesList";
import { LiveChatManager } from "./live-chat/LiveChatManager";

import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
  userEmail: string;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  widgets, 
  userCredits, 
  onRefreshWidgets, 
  onRefreshCredits,
  userEmail
}) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (widgets.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('id')
          .in('widget_id', widgets.map(w => w.id))
          .eq('status', 'active');

        if (error) throw error;
        setUnreadCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    
    // Update count every 5 seconds
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, [widgets]);

  return (
    <Tabs defaultValue="widgets" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="widgets">My Websites</TabsTrigger>
        <TabsTrigger value="live-chat" className="relative">
          Live Chat
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
              {unreadCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>

      <TabsContent value="widgets" className="space-y-6">
        <WebsitesList widgets={widgets} onRefresh={onRefreshWidgets} />
      </TabsContent>

      <TabsContent value="live-chat">
        <LiveChatManager widgets={widgets} userEmail={userEmail} />
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
