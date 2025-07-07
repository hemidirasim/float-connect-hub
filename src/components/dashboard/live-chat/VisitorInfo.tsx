import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, MessageCircle, Clock, MapPin } from 'lucide-react';

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

interface VisitorContact {
  id: string;
  visitor_name: string;
  visitor_email?: string;
  visitor_phone?: string;
  visitor_ip?: string;
  user_agent?: string;
  first_contact_at: string;
  last_contact_at: string;
  total_sessions: number;
  custom_fields?: any;
}

interface VisitorInfoProps {
  session: ChatSession | null;
}

export const VisitorInfo: React.FC<VisitorInfoProps> = ({ session }) => {
  const [visitorContact, setVisitorContact] = useState<VisitorContact | null>(null);
  const [previousSessions, setPreviousSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      loadVisitorInfo();
      loadPreviousSessions();
    } else {
      setVisitorContact(null);
      setPreviousSessions([]);
    }
  }, [session]);

  const loadVisitorInfo = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitor_contacts')
        .select('*')
        .eq('widget_id', session.widget_id)
        .or(`visitor_email.eq.${session.visitor_email},visitor_name.eq.${session.visitor_name}`)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setVisitorContact(data);
    } catch (error) {
      console.error('Error loading visitor info:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreviousSessions = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('widget_id', session.widget_id)
        .neq('id', session.id)
        .or(`visitor_email.eq.${session.visitor_email},visitor_name.eq.${session.visitor_name}`)
        .order('started_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPreviousSessions(data || []);
    } catch (error) {
      console.error('Error loading previous sessions:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} dəqiqə`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}s ${mins}d`;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Aktiv</Badge>;
      case 'ended':
        return <Badge variant="secondary">Bitdi</Badge>;
      case 'abandoned':
        return <Badge variant="destructive">Tərk edildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!session) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ziyarətçi məlumatları görmək üçün söhbət seçin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="w-4 h-4" />
          Ziyarətçi Məlumatları
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{session.visitor_name}</span>
          </div>
          
          {session.visitor_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{session.visitor_email}</span>
            </div>
          )}
          
          {session.visitor_phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{session.visitor_phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(session.started_at)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDuration(session.started_at, session.ended_at)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            {getStatusBadge(session.status)}
          </div>
        </div>

        {/* Visitor Contact Summary */}
        {visitorContact && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Ümumi Məlumatlar</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">İlk təmas:</span>
                  <div>{new Date(visitorContact.first_contact_at).toLocaleDateString('az-AZ')}</div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Son təmas:</span>
                  <div>{new Date(visitorContact.last_contact_at).toLocaleDateString('az-AZ')}</div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Toplam söhbət:</span>
                  <div>{visitorContact.total_sessions}</div>
                </div>

                {visitorContact.visitor_ip && (
                  <div>
                    <span className="text-muted-foreground">IP:</span>
                    <div className="font-mono text-xs">{visitorContact.visitor_ip}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Previous Sessions */}
        {previousSessions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Əvvəlki Söhbətlər</h4>
              
              <div className="space-y-2">
                {previousSessions.map((prevSession) => (
                  <div 
                    key={prevSession.id}
                    className="p-2 bg-muted/50 rounded-lg text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(prevSession.started_at)}
                      </span>
                      {getStatusBadge(prevSession.status)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Müddət: {formatDuration(prevSession.started_at, prevSession.ended_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Custom Fields */}
        {session.custom_fields && Object.keys(session.custom_fields).length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Əlavə Məlumatlar</h4>
              
              <div className="space-y-2">
                {Object.entries(session.custom_fields).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};