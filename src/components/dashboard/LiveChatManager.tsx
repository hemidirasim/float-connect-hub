
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardHeader } from "./DashboardHeader";
import { WidgetSelector } from "./live-chat/WidgetSelector";
import { SessionsList } from "./live-chat/SessionsList";
import { ChatWindow } from "./live-chat/ChatWindow";
import { LiveChatMessage, ChatSession, Widget } from "./live-chat/types";

interface LiveChatManagerProps {
  widgets: Widget[];
  userEmail: string;
}

export const LiveChatManager: React.FC<LiveChatManagerProps> = ({ widgets, userEmail }) => {
  const [selectedWidget, setSelectedWidget] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

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
            toast.success(`Yeni söhbət: ${newSession.visitor_name}`);
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

  const handleJoinConversation = async (sessionId: string) => {
    console.log('Joining conversation:', sessionId);
    setSelectedSession(sessionId);
    
    // Immediately fetch messages for this session
    try {
      const { data, error } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages for session:', error);
      toast.error('Mesajları yükləyərkən xəta baş verdi');
    }
  };

  const sendMessage = async (message: string) => {
    if (!selectedSession) return;

    try {
      console.log('Sending agent message:', message);
      const { data, error } = await supabase
        .from('live_chat_messages')
        .insert([{
          session_id: selectedSession,
          widget_id: selectedWidget,
          sender_name: 'Support Agent',
          message: message,
          is_from_visitor: false
        }])
        .select();

      if (error) throw error;
      console.log('Agent message sent successfully:', data);
      
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
          <WidgetSelector
            widgets={widgets}
            selectedWidget={selectedWidget}
            onWidgetChange={setSelectedWidget}
          />

          {/* Sessions List */}
          <SessionsList
            selectedWidget={selectedWidget}
            selectedSession={selectedSession}
            sessions={sessions}
            loading={loading}
            selectedWidgetData={selectedWidgetData}
            onJoinConversation={handleJoinConversation}
          />
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <ChatWindow
            selectedSession={selectedSession}
            selectedSessionData={selectedSessionData}
            messages={messages}
            onEndSession={endSession}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};
