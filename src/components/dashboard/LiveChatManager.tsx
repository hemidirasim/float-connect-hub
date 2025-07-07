
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Clock, User, X, Minimize2, Archive, MessageSquare } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardHeader } from "./DashboardHeader";

interface LiveChatMessage {
  id: string;
  session_id?: string;
  widget_id: string;
  sender_name: string;
  sender_email?: string;
  message: string;
  is_from_visitor: boolean;
  created_at: string;
}

interface ChatSession {
  id: string;
  widget_id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  custom_fields?: any;
  status: 'active' | 'ended' | 'abandoned';
  started_at: string;
  ended_at?: string;
  last_message_at: string;
}

interface Widget {
  id: string;
  name: string;
  website_url: string;
}

interface LiveChatManagerProps {
  widgets: Widget[];
  userEmail: string;
}

export const LiveChatManager: React.FC<LiveChatManagerProps> = ({ widgets, userEmail }) => {
  const [selectedWidget, setSelectedWidget] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedWidget) {
      fetchSessions();
      
      // Subscribe to new sessions for the selected widget
      const newSessionsChannel = supabase
        .channel(`new-sessions-${selectedWidget}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_sessions',
            filter: `widget_id=eq.${selectedWidget}`
          },
          (payload) => {
            console.log('New session created:', payload);
            const newSession = payload.new as ChatSession;
            setSessions(prev => {
              // Check if session already exists to prevent duplicates
              const exists = prev.some(s => s.id === newSession.id);
              if (exists) return prev;
              return [newSession, ...prev];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(newSessionsChannel);
      };
    }
  }, [selectedWidget]);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages();
      
      // Subscribe to real-time messages for this session with faster polling
      const messagesChannel = supabase
        .channel(`session-messages-${selectedSession}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'live_chat_messages',
            filter: `session_id=eq.${selectedSession}`
          },
          (payload) => {
            console.log('Real-time message received in dashboard:', payload);
            const newMessage = payload.new as LiveChatMessage;
            setMessages(prev => {
              // Check if message already exists to prevent duplicates
              const exists = prev.some(msg => msg.id === newMessage.id);
              if (exists) return prev;
              return [...prev, newMessage];
            });
            
            // Also update session list to reflect latest message time
            setSessions(prev => prev.map(session => 
              session.id === selectedSession 
                ? { ...session, last_message_at: newMessage.created_at }
                : session
            ));
          }
        )
        .subscribe((status) => {
          console.log('Dashboard messages subscription status:', status);
        });

      // Subscribe to session status updates
      const sessionChannel = supabase
        .channel(`session-status-${selectedSession}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_sessions',
            filter: `id=eq.${selectedSession}`
          },
          (payload) => {
            console.log('Session status update received:', payload);
            const updatedSession = payload.new as ChatSession;
            
            // Update sessions list with new status
            setSessions(prev => prev.map(session => 
              session.id === updatedSession.id ? updatedSession : session
            ));
            
            if (updatedSession.status === 'ended' && selectedSession === updatedSession.id) {
              // Session ended, clear selected session
              setSelectedSession('');
              setMessages([]);
            }
          }
        )
        .subscribe((status) => {
          console.log('Dashboard session subscription status:', status);
        });

      // Additional polling for faster updates (fallback)
      const pollInterval = setInterval(() => {
        if (selectedSession) {
          fetchMessages();
        }
      }, 1000); // Poll every 1 second for faster updates

      return () => {
        console.log('Cleaning up dashboard subscriptions');
        supabase.removeChannel(messagesChannel);
        supabase.removeChannel(sessionChannel);
        clearInterval(pollInterval);
      };
    }
  }, [selectedSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSessions = async () => {
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
      
      // Select first active session if available
      const activeSession = data?.find(s => s.status === 'active');
      if (activeSession && !selectedSession) {
        setSelectedSession(activeSession.id);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Söhbətləri yükləyərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedSession) return;
    
    try {
      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('session_id', selectedSession)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Mesajları yükləyərkən xəta baş verdi');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    try {
      console.log('Sending agent message:', newMessage);
      const { data, error } = await supabase
        .from('live_chat_messages')
        .insert([{
          session_id: selectedSession,
          widget_id: selectedWidget,
          sender_name: 'Support Agent',
          message: newMessage.trim(),
          is_from_visitor: false
        }])
        .select();

      if (error) throw error;
      console.log('Agent message sent successfully:', data);
      setNewMessage('');
      
      // Manually add the message to local state if realtime doesn't work
      if (data && data[0]) {
        const newMsg = data[0] as LiveChatMessage;
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMsg.id);
          if (exists) return prev;
          return [...prev, newMsg];
        });
      }
      
      toast.success('Mesaj göndərildi');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj göndərilərkən xəta baş verdi');
    }
  };

  const endSession = async () => {
    if (!selectedSession) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          status: 'ended', 
          ended_at: new Date().toISOString() 
        })
        .eq('id', selectedSession);

      if (error) throw error;
      
      // Refresh sessions
      fetchSessions();
      
      // Clear selected session
      setSelectedSession('');
      setMessages([]);
      
      toast.success('Söhbət bitirildi');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Söhbəti bitirərkən xəta baş verdi');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('az-AZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'İndi';
    if (diffInMinutes < 60) return `${diffInMinutes} dəqiqə əvvəl`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat əvvəl`;
    return `${Math.floor(diffInMinutes / 1440)} gün əvvəl`;
  };

  const getSessionStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Aktiv</Badge>;
      case 'ended':
        return <Badge variant="secondary">Bitdi</Badge>;
      case 'abandoned':
        return <Badge variant="destructive">Tərk edildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const selectedWidgetData = widgets.find(w => w.id === selectedWidget);
  const selectedSessionData = sessions.find(s => s.id === selectedSession);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <DashboardHeader userEmail={userEmail} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Widget and Sessions */}
        <div className="lg:col-span-1 space-y-4">
          {/* Widget Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sayt Seçimi</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedWidget} onValueChange={setSelectedWidget}>
                <SelectTrigger>
                  <SelectValue placeholder="Sayt seçin" />
                </SelectTrigger>
                <SelectContent>
                  {widgets.map((widget) => (
                    <SelectItem key={widget.id} value={widget.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{widget.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {widget.website_url}
                        </span>
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
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedSession === session.id
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-muted/50 hover:bg-muted'
                          }`}
                          onClick={() => setSelectedSession(session.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="font-medium text-sm">
                                {session.visitor_name}
                              </span>
                            </div>
                            {getSessionStatusBadge(session.status)}
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
                                 console.log('Joining conversation:', session.id);
                                 setSelectedSession(session.id);
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
          )}
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-3">
          {selectedSession ? (
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
                  {getSessionStatusBadge(selectedSessionData?.status || '')}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="relative">
                  {selectedSessionData?.status === 'active' && (
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={endSession}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Söhbəti Bitir
                      </Button>
                    </div>
                  )}
                  <ScrollArea className="flex-1 p-4 h-[500px]">
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
                    <div ref={messagesEndRef} />
                  </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  {selectedSessionData?.status === 'active' ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Mesajınızı yazın..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={sendMessage} 
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
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Söhbəti görmək üçün sayt və söhbət seçin</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
