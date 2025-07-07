import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, User, Clock, X } from 'lucide-react';

interface Widget {
  id: string;
  name: string;
  website_url: string;
}

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

interface LiveChatProps {
  widgets: Widget[];
}

export const LiveChat: React.FC<LiveChatProps> = ({ widgets }) => {
  const [selectedWidget, setSelectedWidget] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch sessions when widget changes
  useEffect(() => {
    if (selectedWidget) {
      loadSessions();
      setSelectedSession(null);
      setMessages([]);
    }
  }, [selectedWidget]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!selectedWidget) return;

    const channel = supabase
      .channel(`widget-${selectedWidget}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_sessions',
        filter: `widget_id=eq.${selectedWidget}`
      }, (payload) => {
        const newSession = payload.new as ChatSession;
        setSessions(prev => [newSession, ...prev]);
        toast.success(`Yeni söhbət başladı: ${newSession.visitor_name}`);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_sessions',
        filter: `widget_id=eq.${selectedWidget}`
      }, (payload) => {
        const updatedSession = payload.new as ChatSession;
        setSessions(prev => prev.map(s => 
          s.id === updatedSession.id ? updatedSession : s
        ));
        
        if (selectedSession?.id === updatedSession.id) {
          setSelectedSession(updatedSession);
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_chat_messages',
        filter: `widget_id=eq.${selectedWidget}`
      }, (payload) => {
        const newMsg = payload.new as Message;
        
        // Update sessions list with new message time
        setSessions(prev => prev.map(s => 
          s.id === newMsg.session_id 
            ? { ...s, last_message_at: newMsg.created_at }
            : s
        ));
        
        // If message is for current session, add to messages
        if (selectedSession?.id === newMsg.session_id) {
          setMessages(prev => [...prev, newMsg]);
        }
        
        // Show notification for visitor messages not in current session
        if (newMsg.is_from_visitor && selectedSession?.id !== newMsg.session_id) {
          const session = sessions.find(s => s.id === newMsg.session_id);
          if (session) {
            toast.info(`Yeni mesaj: ${session.visitor_name}`);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedWidget, selectedSession, sessions]);

  const loadSessions = async () => {
    if (!selectedWidget) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('widget_id', selectedWidget)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Söhbətlər yüklənə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Mesajlar yüklənə bilmədi');
    }
  };

  const handleSelectSession = async (session: ChatSession) => {
    setSelectedSession(session);
    await loadMessages(session.id);
    
    // Mark as read
    if (session.unread_count > 0) {
      try {
        await supabase.rpc('mark_session_as_read', { session_id: session.id });
        setSessions(prev => prev.map(s => 
          s.id === session.id ? { ...s, unread_count: 0 } : s
        ));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    try {
      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          session_id: selectedSession.id,
          widget_id: selectedWidget,
          sender_name: 'Support Agent',
          message: newMessage.trim(),
          is_from_visitor: false
        });

      if (error) throw error;
      setNewMessage('');
      toast.success('Mesaj göndərildi');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj göndərilə bilmədi');
    }
  };

  const handleEndSession = async () => {
    if (!selectedSession) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          status: 'ended', 
          ended_at: new Date().toISOString() 
        })
        .eq('id', selectedSession.id);

      if (error) throw error;
      
      setSelectedSession(null);
      setMessages([]);
      await loadSessions();
      
      toast.success('Söhbət bitirildi');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Söhbət bitirilə bilmədi');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Aktiv</Badge>;
      case 'ended':
        return <Badge variant="secondary">Bitdi</Badge>;
      case 'abandoned':
        return <Badge variant="destructive">Tərk edildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      {/* Sidebar - Widget Selection & Sessions */}
      <div className="lg:col-span-1 space-y-4">
        {/* Widget Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Saytı Seçin</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedWidget} onValueChange={setSelectedWidget}>
              <SelectTrigger>
                <SelectValue placeholder="Sayt seçin..." />
              </SelectTrigger>
              <SelectContent>
                {widgets.map((widget) => (
                  <SelectItem key={widget.id} value={widget.id}>
                    <div>
                      <div className="font-medium">{widget.name}</div>
                      <div className="text-xs text-muted-foreground">{widget.website_url}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Sessions List */}
        {selectedWidget && (
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Söhbətlər</CardTitle>
              <CardDescription>
                {sessions.length} söhbət tapıldı
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
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors relative ${
                          selectedSession?.id === session.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                        onClick={() => handleSelectSession(session)}
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
                          {getStatusBadge(session.status)}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <div>Başladı: {formatTime(session.started_at)}</div>
                          <div>Son: {formatTime(session.last_message_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {selectedSession.visitor_name}
                  </CardTitle>
                  <CardDescription>
                    {selectedSession.visitor_email && (
                      <span className="mr-4">📧 {selectedSession.visitor_email}</span>
                    )}
                    {selectedSession.visitor_phone && (
                      <span>📞 {selectedSession.visitor_phone}</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedSession.status)}
                  {selectedSession.status === 'active' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleEndSession}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Bitir
                    </Button>
                  )}
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4 h-[400px]">
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
                  {selectedSession.status === 'active' ? (
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
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-lg">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Söhbət bitib - mesaj göndərmək mümkün deyil</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Söhbəti görmək üçün sayt və söhbət seçin</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};