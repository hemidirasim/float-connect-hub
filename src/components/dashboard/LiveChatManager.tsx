
import React from 'react';
import { DashboardHeader } from "./DashboardHeader";
import { useLiveChatManager } from "./live-chat/useLiveChatManager";
import { WidgetSelector } from "./live-chat/WidgetSelector";
import { SessionsList } from "./live-chat/SessionsList";
import { ChatWindow } from "./live-chat/ChatWindow";
import { Widget } from "./live-chat/types";

interface LiveChatManagerProps {
  widgets: Widget[];
  userEmail: string;
}

export const LiveChatManager: React.FC<LiveChatManagerProps> = ({ widgets, userEmail }) => {
  const {
    selectedWidget,
    setSelectedWidget,
    selectedSession,
    sessions,
    messages,
    loading,
    selectedWidgetData,
    selectedSessionData,
    handleJoinConversation,
    sendMessage,
    endSession
  } = useLiveChatManager(widgets);

  return (
    <div className="space-y-6">
      <DashboardHeader userEmail={userEmail} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        <div className="lg:col-span-1 space-y-4">
          <WidgetSelector
            widgets={widgets}
            selectedWidget={selectedWidget}
            onWidgetChange={setSelectedWidget}
          />

          <SessionsList
            selectedWidget={selectedWidget}
            selectedSession={selectedSession}
            sessions={sessions}
            loading={loading}
            selectedWidgetData={selectedWidgetData}
            onJoinConversation={handleJoinConversation}
          />
        </div>

        <div className="lg:col-span-3">
          <ChatWindow
            selectedSession={selectedSession}
            selectedSessionData={selectedSessionData}
            messages={messages}
            onEndSession={endSession}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};
