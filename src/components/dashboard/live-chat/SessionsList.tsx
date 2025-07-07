
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User, MessageSquare } from 'lucide-react';
import { ChatSession, Widget } from './types';
import { formatRelativeTime } from './utils';
import { SessionStatusBadge } from './SessionStatusBadge';

interface SessionsListProps {
  selectedWidget: string;
  selectedSession: string;
  sessions: ChatSession[];
  loading: boolean;
  selectedWidgetData?: Widget;
  onJoinConversation: (sessionId: string) => void;
}

export const SessionsList: React.FC<SessionsListProps> = ({
  selectedWidget,
  selectedSession,
  sessions,
  loading,
  selectedWidgetData,
  onJoinConversation
}) => {
  if (!selectedWidget) return null;

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Söhbətlər</CardTitle>
        <CardDescription>
          {selectedWidgetData?.name} üçün söhbətlər
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Yüklənir...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Söhbət yoxdur</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {sessions
                .sort((a, b) => {
                  // Yeni sessionlar üsttə olsun
                  const aTime = new Date(a.last_message_at || a.started_at).getTime();
                  const bTime = new Date(b.last_message_at || b.started_at).getTime();
                  return bTime - aTime;
                })
                .map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors relative ${
                    selectedSession === session.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => onJoinConversation(session.id)}
                >
                  {session.unread_count > 0 && selectedSession !== session.id && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                        {session.unread_count}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-sm">
                        {session.visitor_name}
                      </span>
                      {session.unread_count > 0 && selectedSession !== session.id && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <SessionStatusBadge status={session.status} />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                   <div>Başladı: {formatRelativeTime(session.started_at)}</div>
                   <div>Son mesaj: {formatRelativeTime(session.last_message_at)}</div>
                  </div>
                   {session.status === 'active' && selectedSession !== session.id && (
                     <Button
                       size="sm"
                       variant="outline"
                       onClick={(e) => {
                         e.stopPropagation();
                         onJoinConversation(session.id);
                       }}
                       className="mt-2 w-full"
                     >
                       <MessageSquare className="w-4 h-4 mr-1" />
                       Söhbətə Qoşul
                     </Button>
                   )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
