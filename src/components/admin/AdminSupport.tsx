
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Search, Eye, MessageCircle, Clock, CheckCircle } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  user_email: string;
}

export const AdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Xəta",
        description: "Dəstək biletləri yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;

      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );

      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status } : null);
      }

      toast({
        title: "Uğurlu",
        description: "Bilet statusu yeniləndi",
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Xəta",
        description: "Status yeniləmə zamanı xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const sendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          message: replyMessage,
          is_admin: true
        });

      if (error) throw error;

      setReplyMessage('');
      toast({
        title: "Uğurlu",
        description: "Cavab göndərildi",
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Xəta",
        description: "Cavab göndərmə zamanı xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Açıq';
      case 'in_progress': return 'İcrada';
      case 'resolved': return 'Həll edildi';
      default: return 'Naməlum';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-white">Yüklənir...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white text-xl">
          <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <MessageSquare className="w-6 h-6 text-purple-400" />
          </div>
          Dəstək Biletləri
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Bilet axtarın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-gray-600/50 border-purple-500'
                      : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/30'
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium text-sm truncate">
                      {ticket.subject}
                    </h3>
                    <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
                      {getStatusText(ticket.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{ticket.user_email}</span>
                    <span className={`${getPriorityColor(ticket.priority)} font-medium`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(ticket.created_at).toLocaleDateString('az-AZ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4">
            {selectedTicket ? (
              <>
                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{selectedTicket.subject}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        İcrada
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                        className="border-green-500 text-green-400 hover:bg-green-500/20"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Həll Et
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-gray-300 text-sm mb-3">
                    <strong>İstifadəçi:</strong> {selectedTicket.user_email}
                  </div>
                  
                  <div className="text-gray-300 text-sm whitespace-pre-wrap">
                    {selectedTicket.message}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-white font-medium">Cavab yazın:</label>
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Cavabınızı yazın..."
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                  />
                  <Button
                    onClick={sendReply}
                    disabled={!replyMessage.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Cavab Göndər
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Məlumatları görmək üçün bilet seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
