
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWindow } from "./ChatWindow";
import { SessionsList } from "./SessionsList";
import { VisitorInfo } from "./VisitorInfo";
import { VisitorManagement } from "./VisitorManagement";
import { useRealtimeConnection } from "./useRealtimeConnection";
import { MessageCircle, Users, UserX, RefreshCw } from 'lucide-react';

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
  is_banned: boolean;
  custom_fields?: any;
}

interface LiveChatManagerProps {
  widgets: Widget[];
  userEmail: string;
}

export const LiveChatManager: React.FC<LiveChatManagerProps> = ({ widgets, userEmail }) => {
  const [selectedWidget, setSelectedWidget] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');
  const { setupRealtimeChannel, cleanupChannel } = useRealtimeConnection();

  // Add notification sound functionality
  const playNotificationSound = () => {
    try {
      // Try to play a built-in notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoFAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Pwt2QdBz2V2+3QbiEFL3/O8tyLOgkjdsrw4ZlMEAg2jdLx0nnEgIRMHnNfXIibqcgEDjSSJTkQF0UBAA==');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // If built-in sound fails, try a simple beep
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      });
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  // Real-time subscription for sessions
  useEffect(() => {
    if (!selectedWidget) return;

    const channel = setupRealtimeChannel(
      `widget-sessions-${selectedWidget}`,
      'chat_sessions',
      `widget_id=eq.${selectedWidget}`,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          const newSession = payload.new as ChatSession;
          setSessions(prev => {
            // Check if session already exists to avoid duplicates
            if (prev.find(s => s.id === newSession.id)) return prev;
            return [newSession, ...prev];
          });
          playNotificationSound(); // Play sound for new session
          toast.success(`Yeni söhbət başladı: ${newSession.visitor_name}`);
        } else if (payload.eventType === 'UPDATE') {
          const updatedSession = payload.new as ChatSession;
          setSessions(prev => prev.map(s => 
            s.id === updatedSession.id ? updatedSession : s
          ));
          
          if (selectedSession?.id === updatedSession.id) {
            setSelectedSession(updatedSession);
          }
        } else if (payload.eventType === 'DELETE') {
          const deletedSession = payload.old as ChatSession;
          setSessions(prev => prev.filter(s => s.id !== deletedSession.id));
          
          if (selectedSession?.id === deletedSession.id) {
            setSelectedSession(null);
          }
        }
      }
    );

    return () => {
      cleanupChannel(channel);
    };
  }, [selectedWidget]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!selectedWidget) return;

    const channel = setupRealtimeChannel(
      `widget-messages-${selectedWidget}`,
      'live_chat_messages',
      `widget_id=eq.${selectedWidget}`,
      (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new;
          // Play sound for new visitor messages (not admin messages)
          if (newMessage.is_from_visitor) {
            playNotificationSound();
          }
        }
      }
    );

    return () => {
      cleanupChannel(channel);
    };
  }, [selectedWidget]);

  // Load sessions when widget changes
  useEffect(() => {
    if (selectedWidget) {
      loadSessions();
      setSelectedSession(null);
    }
  }, [selectedWidget]);

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

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      
      toast.success('Söhbət silindi');
      await loadSessions();
      
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Söhbət silinə bilmədi');
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          status: 'ended', 
          ended_at: new Date().toISOString() 
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      toast.success('Söhbət bitirildi');
      await loadSessions();
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Söhbət bitirilə bilmədi');
    }
  };

  const handleBanVisitor = async (session: ChatSession, reason: string) => {
    try {
      // Add to banned visitors
      const { error: banError } = await supabase
        .from('banned_visitors')
        .insert({
          widget_id: selectedWidget,
          visitor_email: session.visitor_email,
          visitor_name: session.visitor_name,
          ban_reason: reason,
          banned_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (banError) throw banError;

      // Update session as banned
      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update({ 
          is_banned: true,
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (updateError) throw updateError;

      toast.success('Ziyarətçi ban edildi');
      await loadSessions();
      
      if (selectedSession?.id === session.id) {
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Error banning visitor:', error);
      toast.error('Ziyarətçi ban edilə bilmədi');
    }
  };

  const getActiveSessions = () => sessions.filter(s => s.status === 'active').length;
  const getUnreadCount = () => sessions.reduce((sum, s) => sum + s.unread_count, 0);

  return (
    <div className="space-y-6">
      {/* Widget Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Live Chat İdarəetmə
          </CardTitle>
          <CardDescription>
            Saytınızın söhbətlərini idarə edin və ziyarətçilərlə ünsiyyət qurun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedWidget} onValueChange={setSelectedWidget}>
              <SelectTrigger className="w-[300px]">
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
            
            {selectedWidget && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSessions}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Yenilə
              </Button>
            )}
            
            {selectedWidget && (
              <div className="flex items-center gap-4 ml-auto">
                <Badge variant="outline" className="gap-1">
                  <Users className="w-3 h-3" />
                  {getActiveSessions()} aktiv
                </Badge>
                {getUnreadCount() > 0 && (
                  <Badge variant="destructive">
                    {getUnreadCount()} oxunmamış
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedWidget && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chats" className="relative">
              Söhbətlər
              {getUnreadCount() > 0 && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                  {getUnreadCount()}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="visitors">Ziyarətçilər</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="space-y-6">
            <div className="grid grid-cols-12 gap-6 h-[700px]">
              {/* Sessions List */}
              <div className="col-span-3">
                <SessionsList
                  sessions={sessions}
                  selectedSession={selectedSession}
                  onSelectSession={setSelectedSession}
                  onDeleteSession={handleDeleteSession}
                  onEndSession={handleEndSession}
                  loading={loading}
                />
              </div>

              {/* Chat Window */}
              <div className="col-span-6">
                <ChatWindow
                  session={selectedSession}
                  widgetId={selectedWidget}
                  onBanVisitor={handleBanVisitor}
                />
              </div>

              {/* Visitor Info */}
              <div className="col-span-3">
                <VisitorInfo session={selectedSession} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorManagement selectedWidget={selectedWidget} />
          </TabsContent>
        </Tabs>
      )}

      {!selectedWidget && (
        <Card className="h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Live chat idarəetməsi üçün sayt seçin</p>
          </div>
        </Card>
      )}
    </div>
  );
};
