import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Clock, MessageCircle, Trash2, X, Ban } from 'lucide-react';

interface ChatSession {
  id: string;
  widget_id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  status: 'active' | 'ended' | 'abandoned';
  started_at: string;
  ended_at?: string;
  last_message_at: string;
  unread_count: number;
  is_banned: boolean;
  custom_fields?: any;
}

interface SessionsListProps {
  sessions: ChatSession[];
  selectedSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onEndSession: (sessionId: string) => void;
  loading: boolean;
}

export const SessionsList: React.FC<SessionsListProps> = ({
  sessions,
  selectedSession,
  onSelectSession,
  onDeleteSession,
  onEndSession,
  loading
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string, isBanned: boolean) => {
    if (isBanned) {
      return <Badge variant="destructive" className="gap-1"><Ban className="w-3 h-3" />Ban</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Aktiv</Badge>;
      case 'ended':
        return <Badge variant="secondary">Bitdi</Badge>;
      case 'abandoned':
        return <Badge variant="destructive">Tərk edildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Söhbətlər
        </CardTitle>
        <CardDescription>
          {sessions.length} söhbət tapıldı
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
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
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors relative border ${
                    selectedSession?.id === session.id
                      ? 'bg-primary/10 border-primary/20'
                      : 'bg-card hover:bg-muted/50 border-border'
                  }`}
                  onClick={() => onSelectSession(session)}
                >
                  {/* Unread badge */}
                  {session.unread_count > 0 && (
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
                    </div>
                    {getStatusBadge(session.status, session.is_banned)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Başladı: {formatTime(session.started_at)}
                    </div>
                    <div>Son: {formatTime(session.last_message_at)}</div>
                    {session.visitor_email && (
                      <div className="truncate">📧 {session.visitor_email}</div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1 mt-2">
                    {session.status === 'active' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Bitir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Söhbəti bitir?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {session.visitor_name} ilə söhbəti bitirmək istədiyinizə əminsiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onEndSession(session.id)}>
                              Bitir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Sil
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Söhbəti sil?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {session.visitor_name} ilə olan söhbəti silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteSession(session.id)}>
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};