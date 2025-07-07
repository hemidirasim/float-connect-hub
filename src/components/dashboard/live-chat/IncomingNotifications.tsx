import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, MessageCircle, X, User, MapPin } from 'lucide-react';

interface IncomingMessage {
  id: string;
  session_id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_ip?: string;
  message: string;
  created_at: string;
  widget_id: string;
  sender_name: string;
  is_from_visitor: boolean;
}

interface IncomingNotificationsProps {
  selectedWidget: string;
  onSelectSession: (sessionId: string) => void;
}

export const IncomingNotifications: React.FC<IncomingNotificationsProps> = ({ 
  selectedWidget, 
  onSelectSession 
}) => {
  const [incomingMessages, setIncomingMessages] = useState<IncomingMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  

  // Real-time subscription for new visitor messages
  useEffect(() => {
    if (!selectedWidget) {
      console.log('No widget selected for incoming notifications');
      return;
    }

    console.log('Setting up incoming notifications for widget:', selectedWidget);

    const channel = supabase
      .channel(`incoming-messages-${selectedWidget}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_chat_messages',
        filter: `widget_id=eq.${selectedWidget}`
      }, async (payload) => {
        console.log('New message received in incoming notifications:', payload);
        
        if (payload.new && payload.new.is_from_visitor) {
          console.log('Processing visitor message:', payload.new);
          const newMsg = payload.new;
          
          // Get session info to show visitor details
          try {
            const { data: sessionData, error } = await supabase
              .from('chat_sessions')
              .select('visitor_name, visitor_email, visitor_ip')
              .eq('id', newMsg.session_id)
              .single();

            if (error) {
              console.error('Error fetching session data:', error);
              return;
            }

            const incomingMsg: IncomingMessage = {
              id: newMsg.id,
              session_id: newMsg.session_id,
              message: newMsg.message,
              created_at: newMsg.created_at,
              widget_id: newMsg.widget_id,
              sender_name: newMsg.sender_name,
              is_from_visitor: newMsg.is_from_visitor,
              visitor_name: sessionData?.visitor_name || 'Naməlum',
              visitor_email: sessionData?.visitor_email,
              visitor_ip: sessionData?.visitor_ip,
            };

            console.log('Adding incoming message:', incomingMsg);
            setIncomingMessages(prev => {
              // Check if already exists
              if (prev.find(m => m.id === incomingMsg.id)) {
                console.log('Message already exists, skipping');
                return prev;
              }
              return [incomingMsg, ...prev.slice(0, 9)]; // Keep only 10 latest
            });
          } catch (error) {
            console.error('Error processing incoming message:', error);
          }
        } else {
          console.log('Message is not from visitor, ignoring:', payload.new);
        }
      })
      .subscribe((status, err) => {
        console.log('Incoming notifications subscription status:', status);
        if (err) {
          console.error('Incoming notifications subscription error:', err);
        }
      });

    return () => {
      console.log('Cleaning up incoming notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedWidget]);

  const handleMessageClick = (sessionId: string, messageId: string) => {
    // Remove from incoming when clicked
    setIncomingMessages(prev => prev.filter(msg => msg.id !== messageId));
    onSelectSession(sessionId);
  };

  const handleDismiss = (messageId: string) => {
    setIncomingMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const getCountryFlag = (ip?: string) => {
    // Simple IP to country mapping (you can enhance this)
    if (!ip) return '🌍';
    
    // Azerbaijan IP ranges
    if (ip.startsWith('185.146') || ip.startsWith('178.') || ip.startsWith('87.'))
      return '🇦🇿';
    
    // Turkey
    if (ip.startsWith('78.') || ip.startsWith('88.'))
      return '🇹🇷';
    
    // Russia
    if (ip.startsWith('91.') || ip.startsWith('95.'))
      return '🇷🇺';
    
    return '🌍';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedWidget) return null;

  return (
    <Card className="mb-6 border-l-4 border-l-primary">
      <CardHeader 
        className="pb-2 cursor-pointer bg-gradient-to-r from-primary/10 to-primary/5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <MessageCircle className="w-4 h-4" />
            Incoming ({incomingMessages.length})
          </div>
          {incomingMessages.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {incomingMessages.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-0">
          {incomingMessages.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Yeni mesaj yoxdur</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-1 p-2">
                {incomingMessages.map((message) => (
                  <div
                    key={message.id}
                    className="relative group"
                  >
                    <div
                      className="p-3 bg-gradient-to-r from-pink-100 to-pink-50 hover:from-pink-200 hover:to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 dark:hover:from-pink-900/30 dark:hover:to-pink-800/30 rounded-lg cursor-pointer transition-all duration-200 border border-pink-200/50 dark:border-pink-700/50"
                      onClick={() => handleMessageClick(message.session_id, message.id)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(message.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">
                          {getCountryFlag(message.visitor_ip)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
                            {message.visitor_ip && (
                              <span className="font-mono text-xs bg-white/50 dark:bg-black/50 px-2 py-1 rounded">
                                {message.visitor_ip}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span className="font-medium">{message.visitor_name}</span>
                            {message.visitor_email && (
                              <span className="text-xs">• {message.visitor_email}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(message.created_at)}
                        </div>
                      </div>

                      <div className="text-sm text-foreground/80 line-clamp-2 pl-2 border-l-2 border-pink-300/50 dark:border-pink-700/50">
                        {message.message}
                      </div>
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