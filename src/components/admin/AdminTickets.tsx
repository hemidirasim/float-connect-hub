
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
import { MessageSquare, Reply, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

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

interface TicketStats {
  totalTickets: number;
  openTickets: number;
  repliedTickets: number;
  closedTickets: number;
}

export const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    totalTickets: 0,
    openTickets: 0,
    repliedTickets: 0,
    closedTickets: 0
  });
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

      // Calculate stats
      const stats = {
        totalTickets: ticketsWithEmails.length,
        openTickets: ticketsWithEmails.filter(t => t.status === 'open').length,
        repliedTickets: ticketsWithEmails.filter(t => t.status === 'replied').length,
        closedTickets: ticketsWithEmails.filter(t => t.status === 'closed').length,
      };
      setStats(stats);

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
          user_id: selectedTicket.user_id,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4" />;
      case 'replied':
        return <Reply className="w-4 h-4" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
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
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Yüklənir...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Ümumi Ticket</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalTickets}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Açıq Ticket</p>
                  <p className="text-2xl font-bold text-red-400">{stats.openTickets}</p>
                </div>
                <Clock className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Cavablandı</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.repliedTickets}</p>
                </div>
                <Reply className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Bağlandı</p>
                  <p className="text-2xl font-bold text-green-400">{stats.closedTickets}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5" />
              Dəstək Ticketləri ({tickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Mövzu</TableHead>
                    <TableHead className="text-gray-300">İstifadəçi</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Prioritet</TableHead>
                    <TableHead className="text-gray-300">Tarix</TableHead>
                    <TableHead className="text-gray-300">Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-gray-700 hover:bg-gray-750">
                      <TableCell className="font-medium text-white">{ticket.subject}</TableCell>
                      <TableCell className="text-gray-300">{ticket.user_email}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(ticket.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(ticket.status)}
                          {getStatusText(ticket.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {getPriorityText(ticket.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openTicketDialog(ticket)}
                            className="border-gray-600 text-white hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                          >
                            <SelectTrigger className="w-28 bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="open" className="text-white">Açıq</SelectItem>
                              <SelectItem value="replied" className="text-white">Cavablandı</SelectItem>
                              <SelectItem value="closed" className="text-white">Bağlandı</SelectItem>
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
      </div>

      {/* Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-white">
                <span>{selectedTicket.subject}</span>
                <Badge variant={getStatusColor(selectedTicket.status)} className="flex items-center gap-1">
                  {getStatusIcon(selectedTicket.status)}
                  {getStatusText(selectedTicket.status)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Original Message */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">{selectedTicket.user_email}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300">{selectedTicket.message}</p>
              </div>

              {/* Replies */}
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-lg ${
                    reply.is_admin ? 'bg-red-900/20 ml-8 border-l-4 border-red-500' : 'bg-gray-700 mr-8'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-white">
                      {reply.is_admin ? 'Admin' : selectedTicket.user_email}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(reply.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{reply.message}</p>
                </div>
              ))}

              {/* Reply Form */}
              <div className="border-t border-gray-600 pt-4">
                <Textarea
                  placeholder="Cavabınızı yazın..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Bağla
                  </Button>
                  <Button 
                    onClick={sendReply} 
                    disabled={!replyMessage.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
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
