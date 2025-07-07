import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, UserX, Download, Mail, Phone, Calendar, MessageCircle, Trash2, RotateCcw } from 'lucide-react';

interface VisitorContact {
  id: string;
  widget_id: string;
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

interface BannedVisitor {
  id: string;
  widget_id: string;
  visitor_email?: string;
  visitor_ip?: string;
  visitor_name?: string;
  ban_reason?: string;
  banned_at: string;
  is_active: boolean;
}

interface VisitorManagementProps {
  selectedWidget: string;
}

export const VisitorManagement: React.FC<VisitorManagementProps> = ({ selectedWidget }) => {
  const [contacts, setContacts] = useState<VisitorContact[]>([]);
  const [bannedVisitors, setBannedVisitors] = useState<BannedVisitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedWidget) {
      loadContacts();
      loadBannedVisitors();
    }
  }, [selectedWidget]);

  const loadContacts = async () => {
    if (!selectedWidget) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitor_contacts')
        .select('*')
        .eq('widget_id', selectedWidget)
        .order('last_contact_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Ziyarətçi məlumatları yüklənə bilmədi');
    } finally {
      setLoading(false);
    }
  };

  const loadBannedVisitors = async () => {
    if (!selectedWidget) return;
    
    try {
      const { data, error } = await supabase
        .from('banned_visitors')
        .select('*')
        .eq('widget_id', selectedWidget)
        .eq('is_active', true)
        .order('banned_at', { ascending: false });

      if (error) throw error;
      setBannedVisitors(data || []);
    } catch (error) {
      console.error('Error loading banned visitors:', error);
    }
  };

  const handleUnbanVisitor = async (bannedVisitor: BannedVisitor) => {
    try {
      const { error } = await supabase
        .from('banned_visitors')
        .update({ is_active: false })
        .eq('id', bannedVisitor.id);

      if (error) throw error;
      
      toast.success('Ziyarətçinin banı ləğv edildi');
      await loadBannedVisitors();
    } catch (error) {
      console.error('Error unbanning visitor:', error);
      toast.error('Ban ləğv edilə bilmədi');
    }
  };

  const handleExportContacts = () => {
    if (contacts.length === 0) {
      toast.error('Export etmək üçün məlumat yoxdur');
      return;
    }

    const csvData = [
      ['Ad', 'Email', 'Telefon', 'İlk Təmas', 'Son Təmas', 'Toplam Söhbət', 'IP'],
      ...filteredContacts.map(contact => [
        contact.visitor_name,
        contact.visitor_email || '',
        contact.visitor_phone || '',
        new Date(contact.first_contact_at).toLocaleDateString('az-AZ'),
        new Date(contact.last_contact_at).toLocaleDateString('az-AZ'),
        contact.total_sessions.toString(),
        contact.visitor_ip || ''
      ])
    ];

    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ziyaretci_melumatlari_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Məlumatlar export edildi');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.visitor_email && contact.visitor_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBannedVisitors = bannedVisitors.filter(banned =>
    (banned.visitor_name && banned.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (banned.visitor_email && banned.visitor_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Ziyarətçi İdarəetməsi
          </CardTitle>
          <CardDescription>
            Bütün ziyarətçi məlumatlarını görün və idarə edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Ziyarətçi axtarın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleExportContacts} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="ml-auto flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Users className="w-3 h-3" />
                {contacts.length} ziyarətçi
              </Badge>
              <Badge variant="destructive" className="gap-1">
                <UserX className="w-3 h-3" />
                {bannedVisitors.length} ban
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts" className="relative">
            Ziyarətçilər
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
              {filteredContacts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="banned" className="relative">
            Ban edilmiş
            <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
              {filteredBannedVisitors.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bütün Ziyarətçilər</CardTitle>
              <CardDescription>
                Saytınıza gələn ziyarətçilərin məlumatları
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Yüklənir...
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Ziyarətçi tapılmadı</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{contact.visitor_name}</span>
                              <Badge variant="outline">
                                {contact.total_sessions} söhbət
                              </Badge>
                            </div>
                            
                            {contact.visitor_email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {contact.visitor_email}
                              </div>
                            )}
                            
                            {contact.visitor_phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {contact.visitor_phone}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                İlk: {formatDate(contact.first_contact_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                Son: {formatDate(contact.last_contact_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banned Visitors Tab */}
        <TabsContent value="banned">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ban Edilmiş Ziyarətçilər</CardTitle>
              <CardDescription>
                Ban edilmiş ziyarətçiləri idarə edin
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {filteredBannedVisitors.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <UserX className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Ban edilmiş ziyarətçi yoxdur</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {filteredBannedVisitors.map((banned) => (
                      <div
                        key={banned.id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {banned.visitor_name || 'Məlum deyil'}
                              </span>
                              <Badge variant="destructive">Ban edilib</Badge>
                            </div>
                            
                            {banned.visitor_email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {banned.visitor_email}
                              </div>
                            )}
                            
                            {banned.ban_reason && (
                              <div className="text-sm text-muted-foreground">
                                <strong>Səbəb:</strong> {banned.ban_reason}
                              </div>
                            )}
                            
                            <div className="text-xs text-muted-foreground">
                              Ban tarixi: {formatDate(banned.banned_at)}
                            </div>
                          </div>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Ban ləğv et
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Banı ləğv et?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {banned.visitor_name || banned.visitor_email} üçün banı ləğv etmək istədiyinizə əminsiniz?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleUnbanVisitor(banned)}>
                                  Ban ləğv et
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};