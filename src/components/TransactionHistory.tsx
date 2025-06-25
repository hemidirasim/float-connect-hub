import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Download } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  credits_added: number;
  status: string;
  created_at: string;
  transaction_id: string;
  email: string;
}

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  credits_purchased: number;
  status: string;
  created_at: string;
  paddle_transaction_id: string;
}

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<(Transaction | PaymentTransaction)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Try to fetch from new transactions table first
      const { data: newTransactions, error: newError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!newError && newTransactions && newTransactions.length > 0) {
        setTransactions(newTransactions);
        console.log('Transactions loaded from new table:', newTransactions.length);
        setLoading(false);
        return;
      }
      
      // Fall back to old payment_transactions table
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTransactions(data || []);
      console.log('Transactions loaded from old table:', data?.length || 0);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Function to determine if a transaction is from the new or old table
  const isNewTransaction = (transaction: any): transaction is Transaction => {
    return 'transaction_id' in transaction && 'credits_added' in transaction;
  };

  // Get transaction ID based on transaction type
  const getTransactionId = (transaction: Transaction | PaymentTransaction) => {
    return isNewTransaction(transaction) 
      ? transaction.transaction_id 
      : (transaction as PaymentTransaction).paddle_transaction_id;
  };

  // Get credits from transaction based on transaction type
  const getCredits = (transaction: Transaction | PaymentTransaction) => {
    return isNewTransaction(transaction) 
      ? transaction.credits_added 
      : (transaction as PaymentTransaction).credits_purchased;
  };

  const downloadTransactions = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to download');
      return;
    }

    try {
      // Convert transactions to CSV format
      const headers = ['Date', 'Transaction ID', 'Amount', 'Currency', 'Credits', 'Status'];
      const csvRows = [headers.join(',')];

      transactions.forEach(transaction => {
        const row = [
          new Date(transaction.created_at).toISOString(),
          getTransactionId(transaction),
          transaction.amount,
          transaction.currency,
          getCredits(transaction),
          transaction.status
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Transactions downloaded successfully');
    } catch (error) {
      console.error('Error downloading transactions:', error);
      toast.error('Failed to download transactions');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-600" />
          Transaction History
        </CardTitle>
        {transactions.length > 0 && (
          <Button variant="outline" size="sm" onClick={downloadTransactions}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  <div className="h-2 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{getCredits(transaction)} credits</div>
                  <div className="text-sm text-gray-600">{formatDate(transaction.created_at)}</div>
                  <div className="text-xs text-gray-500">ID: {getTransactionId(transaction)}</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-green-600 mb-1">
                    ${transaction.amount} {transaction.currency}
                  </Badge>
                  <div className="text-xs text-gray-500 capitalize">{transaction.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No transaction history available</p>
            <p className="text-sm mt-2">Transactions will appear here after you make a purchase</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};