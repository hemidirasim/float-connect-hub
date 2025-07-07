import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Clock, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LiveChatMessage {
  id: string;
  widget_id: string;
  sender_name: string;
  sender_email?: string;
  message: string;
  is_from_visitor: boolean;
  created_at: string;
}

interface Widget {
  id: string;
  name: string;
  website_url: string;
}

interface LiveChatManagerProps {
  widgets: Widget[];
}

export const LiveChatManager: React.FC<LiveChatManagerProps> = ({ widgets }) => {
  const [selectedWidget, setSelectedWidget] = useState<string>('');
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedWidget) {
      fetchMessages();
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel('live-chat-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'live_chat_messages',
            filter: `widget_id=eq.${selectedWidget}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as LiveChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedWidget]);

  const fetchMessages = async () => {
    if (!selectedWidget) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('widget_id', selectedWidget)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Mesajları yükləyərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedWidget) return;

    try {
      const { error } = await supabase
        .from('live_chat_messages')
        .insert([{
          widget_id: selectedWidget,
          sender_name: 'Support Agent',
          message: newMessage.trim(),
          is_from_visitor: false
        }]);

      if (error) throw error;
      setNewMessage('');
      toast.success('Mesaj göndərildi');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj göndərilərkən xəta baş verdi');
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Saytlar
            </CardTitle>
            <CardDescription>
              Mesajlarını izləmək üçün sayt seçin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {widgets.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Həələ widget yaradılmayıb
              </p>
            ) : (
              widgets.map((widget) => (
                <Button
                  key={widget.id}
                  variant={selectedWidget === widget.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedWidget(widget.id)}
                >
                  <div className="text-left">
                    <div className="font-medium">{widget.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {widget.website_url}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <div className="lg:col-span-2">
          {selectedWidget ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Canlı Söhbət</CardTitle>
                <CardDescription>
                  {widgets.find(w => w.id === selectedWidget)?.name} üçün mesajlar
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-muted-foreground">Yüklənir...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center text-muted-foreground">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Hələ mesaj yoxdur</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.is_from_visitor ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.is_from_visitor
                                ? 'bg-muted'
                                : 'bg-primary text-primary-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  {message.sender_name}
                                </span>
                              </div>
                              {message.is_from_visitor && (
                                <Badge variant="secondary" className="text-xs">
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
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Input
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Mesajları görmək üçün sayt seçin</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};