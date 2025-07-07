
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, X, MessageCircle } from 'lucide-react';
import { ChatSession, LiveChatMessage } from './types';
import { SessionStatusBadge } from './SessionStatusBadge';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  selectedSession: string;
  selectedSessionData?: ChatSession;
  messages: LiveChatMessage[];
  onEndSession: () => void;
  onSendMessage: (message: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedSession,
  selectedSessionData,
  messages,
  onEndSession,
  onSendMessage
}) => {
  if (!selectedSession) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Söhbəti görmək üçün sayt və söhbət seçin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {selectedSessionData?.visitor_name}
          </CardTitle>
          <CardDescription>
            {selectedSessionData?.visitor_email && (
              <span className="mr-4">📧 {selectedSessionData.visitor_email}</span>
            )}
            {selectedSessionData?.visitor_phone && (
              <span>📞 {selectedSessionData.visitor_phone}</span>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {selectedSessionData && <SessionStatusBadge status={selectedSessionData.status} />}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="relative">
          {selectedSessionData?.status === 'active' && (
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="destructive"
                size="sm"
                onClick={onEndSession}
              >
                <X className="w-4 h-4 mr-1" />
                Söhbəti Bitir
              </Button>
            </div>
          )}
          <MessageList messages={messages} />
        </div>

        <MessageInput
          selectedSession={selectedSession}
          selectedSessionData={selectedSessionData}
          onSendMessage={onSendMessage}
        />
      </CardContent>
    </Card>
  );
};
