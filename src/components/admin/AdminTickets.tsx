
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Reply, Eye } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  user_id: string;
  user_email?: string;
}

interface TicketReply {
  id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  user_id: string;
}

export const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Get user emails
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email');

      const ticketsWithEmails = ticketsData?.map(ticket => ({
        ...ticket,
        user_email: profiles?.find(p => p.id === ticket.user_id)?.email || 'Bilinmir'
      })) || [];

      setTickets(ticketsWithEmails);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Xəta",
        description: "Ticketlər yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast({
        title: "Xəta",
        description: "Cavablar yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const openTicketDialog = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
    await fetchReplies(ticket.id);
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Ticket statusu yeniləndi",
      });

      fetchTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Xəta",
        description: "Ticket statusu yenilənərkən xəta baş verdi",
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
          user_id: selectedTicket.user_id, // This should be the current admin user id in production
          message: replyMessage,
          is_admin: true
        });

      if (error) throw error;

      toast({
        title: "Uğurlu",
        description: "Cavab göndərildi",
      });

      setReplyMessage('');
      await fetchReplies(selectedTicket.id);
      
      // Update ticket status to 'replied' if it was 'open'
      if (selectedTicket.status === 'open') {
        await updateTicketStatus(selectedTicket.id, 'replied');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Xəta",
        description: "Cavab göndərilərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive';
      case 'replied':
        return 'secondary';
      case 'closed':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Açıq';
      case 'replied':
        return 'Cavablandı';
      case 'closed':
        return 'Bağlandı';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Yüksək';
      case 'medium':
        return 'Orta';
      case 'low':
        return 'Aşağı';
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Dəstək Ticketləri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Yüklənir...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Dəstək Ticketləri ({tickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mövzu</TableHead>
                  <TableHead>İstifadəçi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioritet</TableHead>
                  <TableHead>Tarix</TableHead>
                  <TableHead>Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{ticket.user_email}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {getStatusText(ticket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {getPriorityText(ticket.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTicketDialog(ticket)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          value={ticket.status}
                          onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Açıq</SelectItem>
                            <SelectItem value="replied">Cavablandı</SelectItem>
                            <SelectItem value="closed">Bağlandı</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTicket.subject}</span>
                <Badge variant={getStatusColor(selectedTicket.status)}>
                  {getStatusText(selectedTicket.status)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Original Message */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{selectedTicket.user_email}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{selectedTicket.message}</p>
              </div>

              {/* Replies */}
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-lg ${
                    reply.is_admin ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">
                      {reply.is_admin ? 'Admin' : selectedTicket.user_email}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(reply.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{reply.message}</p>
                </div>
              ))}

              {/* Reply Form */}
              <div className="border-t pt-4">
                <Textarea
                  placeholder="Cavabınızı yazın..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Bağla
                  </Button>
                  <Button onClick={sendReply} disabled={!replyMessage.trim()}>
                    <Reply className="w-4 h-4 mr-2" />
                    Cavab Göndər
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
