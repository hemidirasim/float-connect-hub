
import React from 'react';
import { DashboardHeader } from "./DashboardHeader";
import { LiveChat } from "./LiveChat";
import { Widget } from "./live-chat/types";

interface LiveChatManagerProps {
  widgets: Widget[];
  userEmail: string;
}

export const LiveChatManager: React.FC<LiveChatManagerProps> = ({ widgets, userEmail }) => {
  return (
    <div className="space-y-6">
      <DashboardHeader userEmail={userEmail} />
      <LiveChat widgets={widgets} />
    </div>
  );
};
