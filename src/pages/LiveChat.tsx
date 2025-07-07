import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Send, MessageCircle, Clock, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Widget {
  id: string;
  name: string;
  website_url: string;
  live_chat_enabled: boolean;
}

interface ChatSession {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  status: 'active' | 'ended' | 'abandoned';
  started_at: string;
  ended_at: string;
  last_message_at: string;
  custom_fields: any;
}

interface ChatMessage {
  id: string;
  message: string;
  sender_name: string;
  sender_email: string;
  is_from_visitor: boolean;
  created_at: string;
  session_id: string;
}

const LiveChat = () => {
  const { widgetId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [widget, setWidget] = useState<Widget | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingWidget, setLoadingWidget] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (user && widgetId) {
      fetchWidget();
      fetchSessions();
    }
  }, [user, widgetId]);

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id);
      
      // Real-time subscription for new messages
      const channel = supabase
        .channel(`messages-${selectedSession.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'live_chat_messages',
            filter: `session_id=eq.${selectedSession.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedSession]);

  const fetchWidget = async () => {
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('id, name, website_url, live_chat_enabled')
        .eq('id', widgetId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setWidget(data);
    } catch (error) {
      console.error('Error fetching widget:', error);
      toast.error('Widget not found');
      navigate('/dashboard');
    } finally {
      setLoadingWidget(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('widget_id', widgetId)
        .order('started_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Error loading chat sessions');
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error loading messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || sendingMessage) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          widget_id: widgetId!,
          session_id: selectedSession.id,
          message: newMessage,
          sender_name: user?.email?.split('@')[0] || 'Agent',
          sender_email: user?.email || '',
          is_from_visitor: false
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
    } finally {
      setSendingMessage(false);
    }
  };

  const endSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      toast.success('Chat session ended');
      fetchSessions();
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Error ending session');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      ended: 'secondary',
      abandoned: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (loading || loadingWidget) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Live Chat</h1>
            <p className="text-gray-600">{widget?.website_url}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Chat Sessions ({sessions.length})
              </CardTitle>
              <CardDescription>
                Click on a session to view messages
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {sessions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No chat sessions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSession?.id === session.id
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{session.visitor_name}</span>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            {new Date(session.started_at).toLocaleString()}
                          </div>
                          {session.visitor_email && (
                            <p className="truncate">{session.visitor_email}</p>
                          )}
                        </div>
                        {session.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              endSession(session.id);
                            }}
                            className="mt-2 w-full"
                          >
                            End Session
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedSession ? (
                  `Chat with ${selectedSession.visitor_name}`
                ) : (
                  'Select a chat session'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedSession ? (
                <div className="flex flex-col h-[600px]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.is_from_visitor ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.is_from_visitor
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {message.sender_name}
                              </span>
                              <span className="text-xs opacity-70">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                            <p>{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={selectedSession.status === 'active' ? "Type your message..." : "Chat session has ended - cannot send messages"}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && selectedSession.status === 'active') {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={selectedSession.status !== 'active'}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim() || sendingMessage || selectedSession.status !== 'active'}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Select a chat session to view messages</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;