import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useRealtimeConnection } from "./useRealtimeConnection";
import { User, Send, MessageCircle, Clock, Ban, Trash2, MessageSquareOff, MoreVertical } from 'lucide-react';

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

interface Message {
  id: string;
  session_id: string;
  widget_id: string;
  sender_name: string;
  message: string;
  is_from_visitor: boolean;
  created_at: string;
}

interface ChatWindowProps {
  session: ChatSession | null;
  widgetId: string;
  onBanVisitor: (session: ChatSession, reason: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ session, widgetId, onBanVisitor }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [banReason, setBanReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const { setupRealtimeChannel, cleanupChannel } = useRealtimeConnection();

  // Load messages when session changes
  useEffect(() => {
    if (session) {
      loadMessages();
      markAsRead();
    } else {
      setMessages([]);
    }
  }, [session]);

  // Real-time messages subscription
  useEffect(() => {
    if (!session) return;

    const channel = setupRealtimeChannel(
      `session-messages-${session.id}`,
      'live_chat_messages',
      `session_id=eq.${session.id}`,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new as Message;
          
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          
          // Auto-scroll to bottom
          setTimeout(() => {
            const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollArea) {
              scrollArea.scrollTop = scrollArea.scrollHeight;
            }
          }, 100);
        }
      }
    );

    return () => {
      cleanupChannel(channel);
    };
  }, [session?.id]);

  const loadMessages = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Mesajlar yüklənə bilmədi');
    }
  };

  const markAsRead = async () => {
    if (!session || session.unread_count === 0) return;
    
    try {
      await supabase.rpc('mark_session_as_read', { session_id: session.id });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session || loading) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          session_id: session.id,
          widget_id: widgetId,
          sender_name: 'Support Agent',
          message: newMessage.trim(),
          is_from_visitor: false
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj göndərilə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;
    
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          status: 'ended', 
          ended_at: new Date().toISOString() 
        })
        .eq('id', session.id);

      if (error) throw error;
      
      toast.success('Söhbət bitirildi');
      setShowEndDialog(false);
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Söhbət bitirilə bilmədi');
    }
  };

  const handleDeleteSession = async () => {
    if (!session) return;
    
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', session.id);

      if (error) throw error;
      
      toast.success('Söhbət silindi');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Söhbət silinə bilmədi');
    }
  };

  const handleBan = () => {
    if (session && banReason.trim()) {
      onBanVisitor(session, banReason.trim());
      setBanReason('');
      setShowBanDialog(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!session) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Söhbəti görmək üçün siyahıdan seçin</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header with Actions Menu */}
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-5 h-5" />
            {session.visitor_name}
          </CardTitle>
          <CardDescription>
            {session.visitor_email && (
              <span className="mr-4">📧 {session.visitor_email}</span>
            )}
            {session.visitor_phone && (
              <span>📞 {session.visitor_phone}</span>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
            {session.status === 'active' ? 'Aktiv' : 'Bitib'}
          </Badge>
          
          {/* Actions Menu */}
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem onClick={() => setShowEndDialog(true)}>
                <MessageSquareOff className="w-4 h-4 mr-2" />
                Söhbəti bitir
              </ContextMenuItem>
              <ContextMenuItem onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Söhbəti sil
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => setShowBanDialog(true)}>
                <Ban className="w-4 h-4 mr-2" />
                Ziyarətçini ban et
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4 max-h-[500px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_from_visitor ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.is_from_visitor
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {message.sender_name}
                    </span>
                    {message.is_from_visitor && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        Ziyarətçi
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{message.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                    <Clock className="w-3 h-3" />
                    {formatTime(message.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          {session.status === 'active' && !session.is_banned ? (
            <div className="flex gap-2">
              <Input
                placeholder="Mesajınızı yazın..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || loading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-lg">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>
                {session.is_banned 
                  ? 'Ziyarətçi ban edilib - mesaj göndərmək mümkün deyil' 
                  : 'Söhbət bitib - mesaj göndərmək mümkün deyil'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Ban Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ziyarətçini ban et</AlertDialogTitle>
            <AlertDialogDescription>
              {session.visitor_name} adlı ziyarətçini ban etmək istədiyinizə əminsiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="ban-reason">Ban səbəbi</Label>
            <Textarea
              id="ban-reason"
              placeholder="Ban səbəbini qeyd edin..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="mt-1"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBan}
              disabled={!banReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Ban et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Session Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Söhbəti bitir</AlertDialogTitle>
            <AlertDialogDescription>
              Bu söhbəti bitirmək istədiyinizə əminsiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndSession}>
              Bitir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Session Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Söhbəti sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu söhbəti silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ləğv et</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSession}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
