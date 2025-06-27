
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Send, ArrowLeft, User, MessageCircleMore } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  user_id: string;
}

interface TicketReply {
  id: string;
  ticket_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  user_id: string;
}

export const SupportTickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketReplies(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Ticketlər yüklənərkən xəta');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketReplies = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTicketReplies(data || []);
    } catch (error) {
      console.error('Error fetching ticket replies:', error);
      toast.error('Mesajlar yüklənərkən xəta');
    }
  };

  const handleSubmitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Mövzu və mesaj tələb olunur');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          subject: newTicket.subject,
          message: newTicket.message,
          priority: newTicket.priority,
          user_id: user?.id,
          status: 'open'
        }]);

      if (error) throw error;

      toast.success('Dəstək ticketi yaradıldı!');
      setModalOpen(false);
      setNewTicket({ subject: '', message: '', priority: 'medium' });
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Ticket yaradılarkən xəta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('ticket_replies')
        .insert([{
          ticket_id: selectedTicket.id,
          message: replyMessage,
          user_id: user?.id,
          is_admin: false
        }]);

      if (error) throw error;

      toast.success('Cavab göndərildi!');
      setReplyMessage('');
      fetchTicketReplies(selectedTicket.id);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Cavab göndərilərkən xəta');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-yellow-600 bg-yellow-100';
      case 'closed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Ticketlər yüklənir...</p>
      </div>
    );
  }

  // Show ticket detail view
  if (selectedTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedTicket(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ticketlərə qayıt
          </Button>
          <h2 className="text-xl font-semibold">Ticket Detalları</h2>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                <CardDescription>
                  Yaradılıb: {new Date(selectedTicket.created_at).toLocaleDateString('az-AZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={`${getStatusColor(selectedTicket.status)} flex items-center gap-1`}>
                  {getStatusIcon(selectedTicket.status)}
                  {selectedTicket.status === 'open' ? 'Açıq' : 'Bağlı'}
                </Badge>
                <Badge className={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority === 'high' ? 'Yüksək' : 
                   selectedTicket.priority === 'medium' ? 'Orta' : 'Aşağı'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Original Message */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Siz</span>
                  <span className="text-xs text-gray-500">
                    {new Date(selectedTicket.created_at).toLocaleString('az-AZ')}
                  </span>
                </div>
                <p className="text-gray-800">{selectedTicket.message}</p>
              </div>

              {/* Replies */}
              {ticketReplies.map((reply) => (
                <div 
                  key={reply.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    reply.is_admin 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-gray-50 border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircleMore className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {reply.is_admin ? 'Dəstək Komandası' : 'Siz'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.created_at).toLocaleString('az-AZ')}
                    </span>
                  </div>
                  <p className="text-gray-800">{reply.message}</p>
                </div>
              ))}

              {/* Reply Form */}
              {selectedTicket.status === 'open' && (
                <div className="space-y-3 border-t pt-4">
                  <Label htmlFor="reply">Əlavə məlumat və ya sual əlavə edin</Label>
                  <Textarea
                    id="reply"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Əlavə məlumat və ya suallar..."
                    rows={4}
                  />
                  <Button onClick={handleSendReply} disabled={!replyMessage.trim() || submitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Göndərilir...' : 'Cavab Göndər'}
                  </Button>
                </div>
              )}

              {selectedTicket.status === 'closed' && (
                <div className="text-center py-4 text-gray-500">
                  Bu ticket bağlanıb. Yeni sual üçün yeni ticket yaradın.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Dəstək Ticketləri</h2>
          <p className="text-gray-600">Sual və problemlər üçün ticket yaradın</p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Yeni Dəstək Ticketi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Mövzu</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Problemin qısa təsviri"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritet</Label>
                <Select 
                  value={newTicket.priority} 
                  onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Aşağı</SelectItem>
                    <SelectItem value="medium">Orta</SelectItem>
                    <SelectItem value="high">Yüksək</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Mesaj</Label>
                <Textarea
                  id="message"
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Problemi ətraflı təsvir edin..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Ləğv et
                </Button>
                <Button onClick={handleSubmitTicket} disabled={submitting}>
                  {submitting ? 'Göndərilir...' : 'Göndər'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Hələ ticket yoxdur</h3>
            <p className="text-gray-600 mb-4">Sual və problemlər üçün dəstək ticketi yaradın</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk Ticket Yaradın
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTicket(ticket)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                    <CardDescription>
                      {new Date(ticket.created_at).toLocaleDateString('az-AZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status === 'open' ? 'Açıq' : 'Bağlı'}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority === 'high' ? 'Yüksək' : 
                       ticket.priority === 'medium' ? 'Orta' : 'Aşağı'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-2">{ticket.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
