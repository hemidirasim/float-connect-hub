
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Users, TrendingUp, DollarSign } from 'lucide-react';
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface Transaction {
  id: string;
  email: string;
  amount: number;
  currency: string;
  credits_added: number;
  status: string;
  created_at: string;
  transaction_id: string;
  product_id?: string;
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  totalCredits: number;
}

export const AdminPayments = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalTransactions: 0,
    totalCredits: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  useEffect(() => {
    if (adminUser) {
      fetchTransactions();
    }
  }, [adminUser]);

  const fetchTransactions = async () => {
    if (!adminUser) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Transactions error:', error);
      } else {
        setTransactions(data || []);

        const stats = {
          totalRevenue: data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0,
          totalTransactions: data?.length || 0,
          totalCredits: data?.reduce((sum, t) => sum + t.credits_added, 0) || 0
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Xəta",
        description: "Ödənişlər yüklənərkən xəta baş verdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Gözləyir';
      case 'failed':
        return 'Uğursuz';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-600 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
          <CardContent className="p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-500 border-opacity-75 mx-auto"></div>
              <p className="mt-4 text-gray-400 font-medium">Ödənişlər yüklənir...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
        <CardContent className="p-8">
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <p className="text-xl text-gray-300 font-medium">Admin girişi tələb olunur</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-800/20"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ümumi Gəlir</p>
                <p className="text-3xl font-bold text-gray-100">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-gray-600/30 rounded-xl border border-gray-600/40">
                <TrendingUp className="w-8 h-8 text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-800/20"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ümumi Əməliyyat</p>
                <p className="text-3xl font-bold text-gray-100">{stats.totalTransactions}</p>
              </div>
              <div className="p-3 bg-gray-600/30 rounded-xl border border-gray-600/40">
                <CreditCard className="w-8 h-8 text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-800/20"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Satılan Kredit</p>
                <p className="text-3xl font-bold text-gray-100">{stats.totalCredits}</p>
              </div>
              <div className="p-3 bg-gray-600/30 rounded-xl border border-gray-600/40">
                <Users className="w-8 h-8 text-gray-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-gray-800/60 backdrop-blur-sm border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white text-xl">
            <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
              <CreditCard className="w-6 h-6 text-red-400" />
            </div>
            Ödənişlər ({transactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50 hover:bg-gray-700/20">
                  <TableHead className="text-gray-300 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Məbləğ</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Valyuta</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Kreditlər</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Tarix</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Əməliyyat ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                    <TableCell className="font-medium text-gray-200">{transaction.email}</TableCell>
                    <TableCell className="text-gray-100 font-semibold">${Number(transaction.amount).toFixed(2)}</TableCell>
                    <TableCell className="text-gray-300 uppercase">{transaction.currency}</TableCell>
                    <TableCell className="text-gray-100 font-semibold">{transaction.credits_added}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(transaction.status)} className="font-medium">
                        {getStatusText(transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{new Date(transaction.created_at).toLocaleDateString('az-AZ')}</TableCell>
                    <TableCell className="font-mono text-xs text-gray-400">{transaction.transaction_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
