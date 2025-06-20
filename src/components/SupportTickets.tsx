
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
}

export const SupportTickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
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
      toast.error('Biletlər yüklənməkdə xəta');
    } finally {
      setLoading(false);
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
          user_id: user?.id
        }]);

      if (error) throw error;

      toast.success('Dəstək bileti yaradıldı!');
      setModalOpen(false);
      setNewTicket({ subject: '', message: '', priority: 'medium' });
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Bilet yaradılarkən xəta baş verdi');
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
        <p className="text-gray-600">Biletlər yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Dəstək biletləri</h2>
          <p className="text-gray-600">Suallarınız və problemləriniz üçün bilet yaradın</p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Yeni bilet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Yeni dəstək bileti</DialogTitle>
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
            <h3 className="text-lg font-semibold mb-2">Hələ biletiniz yoxdur</h3>
            <p className="text-gray-600 mb-4">Sual və ya problemlər üçün dəstək bileti yaradın</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              İlk bileti yarat
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
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
                <p className="text-gray-700">{ticket.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
