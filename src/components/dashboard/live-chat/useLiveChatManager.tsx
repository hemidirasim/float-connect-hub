import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LiveChatMessage, ChatSession, Widget } from "./types";

export const useLiveChatManager = (widgets: Widget[]) => {
  const [selectedWidget, setSelectedWidget] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
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
      console.error('Error fetching sessions:', error);
      toast.error('Söhbətləri yükləyərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }, [selectedWidget]);

  const fetchMessages = useCallback(async () => {
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
  }, [selectedSession]);

  // Widget-level real-time subscriptions
  useEffect(() => {
    if (!selectedWidget) {
      setSessions([]);
      return;
    }
    
    fetchSessions();
    
    const channel = supabase.channel(`widget-${selectedWidget}`, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_sessions',
        filter: `widget_id=eq.${selectedWidget}`
      }, (payload) => {
        const newSession = payload.new as ChatSession;
        setSessions(prev => {
          if (prev.some(s => s.id === newSession.id)) return prev;
          return [newSession, ...prev];
        });
        toast.success(`Yeni söhbət: ${newSession.visitor_name}`);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_sessions',
        filter: `widget_id=eq.${selectedWidget}`
      }, (payload) => {
        const updatedSession = payload.new as ChatSession;
        setSessions(prev => prev.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        ));
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Widget subscription failed, refetching data');
          setTimeout(fetchSessions, 1000);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedWidget, fetchSessions]);

  // Session-level real-time subscriptions
  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      return;
    }
    
    fetchMessages();
    markSessionAsRead(selectedSession);
    
    const channel = supabase.channel(`session-${selectedSession}`, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_chat_messages',
        filter: `session_id=eq.${selectedSession}`
      }, (payload) => {
        const newMessage = payload.new as LiveChatMessage;
        setMessages(prev => {
          if (prev.some(msg => msg.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        
        // Update session timestamp
        setSessions(prev => prev.map(session => 
          session.id === selectedSession 
            ? { ...session, last_message_at: newMessage.created_at }
            : session
        ));
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_sessions',
        filter: `id=eq.${selectedSession}`
      }, (payload) => {
        const updatedSession = payload.new as ChatSession;
        setSessions(prev => prev.map(session => 
          session.id === updatedSession.id ? updatedSession : session
        ));
        
        if (updatedSession.status === 'ended') {
          setSelectedSession('');
          setMessages([]);
          toast.info('Söhbət bitirildi');
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Session subscription failed, refetching messages');
          setTimeout(fetchMessages, 1000);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession, fetchMessages]);

  // Notification subscription for new messages
  useEffect(() => {
    if (!selectedWidget) return;

    const channel = supabase.channel(`notifications-${selectedWidget}`, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_chat_messages',
        filter: `widget_id=eq.${selectedWidget}`
      }, (payload) => {
        const newMessage = payload.new as LiveChatMessage;
        
        // Only show notification if it's from visitor and not current session
        if (newMessage.is_from_visitor && newMessage.session_id !== selectedSession) {
          setSessions(prev => {
            const session = prev.find(s => s.id === newMessage.session_id);
            if (session) {
              toast.info(`Yeni mesaj: ${session.visitor_name}`);
            }
            return prev.map(s => 
              s.id === newMessage.session_id 
                ? { ...s, last_message_at: newMessage.created_at }
                : s
            );
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedWidget, selectedSession]);

  const markSessionAsRead = async (sessionId: string) => {
    try {
      await supabase.rpc('mark_session_as_read', { session_id: sessionId });
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, unread_count: 0 } : session
      ));
    } catch (error) {
      console.error('Error marking session as read:', error);
    }
  };

  const handleJoinConversation = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  const sendMessage = async (message: string) => {
    if (!selectedSession || !selectedWidget) return;

    try {
      const { error } = await supabase
        .from('live_chat_messages')
        .insert({
          session_id: selectedSession,
          widget_id: selectedWidget,
          sender_name: 'Support Agent',
          message: message,
          is_from_visitor: false
        });

      if (error) throw error;
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
      
      setSelectedSession('');
      setMessages([]);
      fetchSessions();
      
      toast.success('Söhbət bitirildi');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Söhbəti bitirərkən xəta baş verdi');
    }
  };

  const selectedWidgetData = widgets.find(w => w.id === selectedWidget);
  const selectedSessionData = sessions.find(s => s.id === selectedSession);

  return {
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
  };
};