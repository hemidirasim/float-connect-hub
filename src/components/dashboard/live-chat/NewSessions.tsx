
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Sparkles, User, Clock, MessageCircle, ChevronDown, ChevronRight } from 'lucide-react';

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

interface NewSessionsProps {
  selectedWidget: string;
  onSelectSession: (session: ChatSession) => void;
  onMoveToMain: (sessionId: string) => void;
}

export const NewSessions: React.FC<NewSessionsProps> = ({ 
  selectedWidget, 
  onSelectSession,
  onMoveToMain
}) => {
  const [newSessions, setNewSessions] = useState<ChatSession[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio();
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  // Real-time subscription for new chat sessions
  useEffect(() => {
    if (!selectedWidget) {
      console.log('No widget selected for new sessions');
      return;
    }

    console.log('Setting up new sessions realtime for widget:', selectedWidget);

    const channel = supabase
      .channel(`new-sessions-${selectedWidget}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_sessions',
        filter: `widget_id=eq.${selectedWidget}`
      }, (payload) => {
        console.log('New session created:', payload);
        
        if (payload.new) {
          const newSession = payload.new as ChatSession;
          
          setNewSessions(prev => {
            // Check if already exists
            if (prev.find(s => s.id === newSession.id)) {
              console.log('Session already exists, skipping');
              return prev;
            }
            
            console.log('Adding new session to new sessions list:', newSession);
            
            // Play notification sound
            playNotificationSound();
            
            toast.success(`Yeni söhbət: ${newSession.visitor_name}`, {
              description: "Yeni söhbətlər bölməsində görünür"
            });
            
            return [newSession, ...prev];
          });
        }
      })
      .subscribe((status, err) => {
        console.log('New sessions subscription status:', status);
        if (err) {
          console.error('New sessions subscription error:', err);
        }
      });

    return () => {
      console.log('Cleaning up new sessions subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedWidget]);

  const handleSessionClick = (session: ChatSession) => {
    console.log('Moving session to main list:', session.id);
    
    // Remove from new sessions
    setNewSessions(prev => prev.filter(s => s.id !== session.id));
    
    // Move to main sessions
    onMoveToMain(session.id);
    
    // Select the session
    onSelectSession(session);
    
    toast.info(`${session.visitor_name} əsas siyahıya köçürüldü`);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedWidget) return null;

  return (
    <Card className="mb-4 border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 dark:text-emerald-300">Yeni Söhbətlər</span>
          </div>
          {newSessions.length > 0 && (
            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 animate-pulse">
              {newSessions.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0">
          {newSessions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Yeni söhbət yoxdur</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[200px]">
              <div className="space-y-1 p-2">
                {newSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 bg-white/70 dark:bg-slate-800/70 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/30 rounded-lg cursor-pointer transition-all duration-200 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm hover:shadow-md"
                    onClick={() => handleSessionClick(session)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-sm text-emerald-800 dark:text-emerald-200">
                          {session.visitor_name}
                        </span>
                      </div>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">
                        YENİ
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(session.started_at)}
                      </div>
                      {session.visitor_email && (
                        <div className="truncate max-w-[150px]">
                          📧 {session.visitor_email}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                      Klikləyin → Əsas siyahıya köçürün
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
};
