import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, History, Download } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserCredits {
  balance: number;
  total_spent: number;
}

interface BillingSectionProps {
  userCredits: UserCredits;
  onCreditsUpdate: () => void;
}

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  credits_purchased: number;
  status: string;
  product_id: string;
}

const creditPackages = [
  { 
    credits: 200, 
    price: 10, 
    productId: 'pri_01jrmk0bq3y6cfd8w2gsbh9fax',
    popular: false 
  },
  { 
    credits: 500, 
    price: 20, 
    productId: 'pri_01js1kfkamvrte2kdppgch8fyd',
    popular: true 
  },
  { 
    credits: 800, 
    price: 30, 
    productId: 'pri_01js1kg2d3q6cf947hz5v6eqjy',
    popular: false 
  },
  { 
    credits: 10, 
    price: 1, 
    productId: 'pri_01jygks56v6vpvncqxn5harqae',
    popular: false 
  },
];

declare global {
  interface Window {
    Paddle: any;
  }
}

export const BillingSection: React.FC<BillingSectionProps> = ({ userCredits, onCreditsUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      console.log('Paddle script loaded');
      initializePaddle();
    };
    script.onerror = () => {
      console.error('Failed to load Paddle script');
      toast.error('Payment system failed to load');
    };
    document.head.appendChild(script);

    // Fetch transaction history
    fetchTransactionHistory();

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      setTransactionsLoading(true);
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const initializePaddle = async () => {
    try {
      if (window.Paddle) {
        window.Paddle.Environment.set("production");
        const { data: { user } } = await supabase.auth.getUser();

        window.Paddle.Initialize({
          token: "live_c780f029236977ad3ae72c25114",
          eventCallback: function(event: any) {
            console.log('Paddle event:', event);
            
            if (event.name === "checkout.completed") {
              handleCheckoutCompleted(event.data);
            }
            
            if (event.name === "checkout.closed") {
              setLoading(false);
            }
          }
        });

        setPaddleLoaded(true);
        console.log('Paddle initialized successfully');
      }
    } catch (error) {
      console.error('Paddle initialization error:', error);
      toast.error('Failed to initialize the payment system');
    }
  };

  const handleCheckoutCompleted = async (data: any) => {
    try {
      console.log('Checkout completed:', data);
      toast.success('Payment completed successfully! Your credit balance will be updated.');
      setTimeout(() => {
        onCreditsUpdate();
        fetchTransactionHistory(); // Refresh transaction history
      }, 2000);
    } catch (error) {
      console.error('Error handling checkout completion:', error);
      toast.error('Payment was completed, but credits were not added. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseCredits = async (credits: number, price: number, productId: string) => {
    if (!paddleLoaded || !window.Paddle) {
      toast.error('The payment system has not loaded yet, please wait');
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('You have to login');
        setLoading(false);
        return;
      }

      console.log('Opening Paddle checkout for:', { credits, price, productId });

      window.Paddle.Checkout.open({
        items: [{
          priceId: productId,
          quantity: 1
        }],
        settings: {
          theme: "light",
          displayMode: "overlay",
          allowLogout: false
        },
        customer: {
          email: user.email
        },
        customData: {
          user_id: user.id,
          credits: credits.toString()
        }
      });

    } catch (error: any) {
      console.error('Error opening Paddle checkout:', error);
      toast.error('Failed to open the payment page: ' + error.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductName = (productId: string) => {
    const package_ = creditPackages.find(pkg => pkg.productId === productId);
    return package_ ? `${package_.credits} Credits` : 'Credit Package';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{userCredits.balance}</div>
              <div className="text-sm text-gray-600">Current credit</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">{userCredits.total_spent}</div>
              <div className="text-sm text-gray-600">Spent credit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Billing</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'packages' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('packages')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
              <Button 
                variant={activeTab === 'history' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('history')}
              >
                <History className="w-4 h-4 mr-2" />
                Transaction History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === 'packages' && (
            <>
              <CardDescription className="mb-4">Buy credits for widget views</CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {creditPackages.map((pkg, index) => (
                  <Card key={index} className={`relative ${pkg.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-4 bg-blue-600">Popular</Badge>
                    )}
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{pkg.credits}</div>
                      <div className="text-sm text-gray-600 mb-4">credits</div>
                      <div className="text-xl font-semibold mb-4">${pkg.price}</div>
                      <Button 
                        className="w-full" 
                        onClick={() => handlePurchaseCredits(pkg.credits, pkg.price, pkg.productId)}
                        disabled={loading || !paddleLoaded}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {loading ? 'Loading...' : 'Buy'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!paddleLoaded && (
                <div className="text-center mt-4 text-sm text-gray-500">
                  Payment system loading...
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Transaction History</h3>
                <Button variant="outline" size="sm" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              {transactionsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading transaction history...</p>
                </div>
              ) : transactions.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.created_at)}</TableCell>
                          <TableCell>{getProductName(transaction.product_id)}</TableCell>
                          <TableCell>{transaction.amount} {transaction.currency}</TableCell>
                          <TableCell>{transaction.credits_purchased}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'outline'}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No transactions yet</h3>
                  <p className="text-gray-500 mb-4">Your payment history will appear here</p>
                  <Button onClick={() => setActiveTab('packages')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            Credit cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Standard widget display</div>
                <div className="text-sm text-gray-600">Non-video widgets</div>
              </div>
              <Badge variant="outline">1 credit</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium">Video widget display</div>
                <div className="text-sm text-gray-600">Widgets with video</div>
              </div>
              <Badge variant="outline" className="text-purple-600">2 credits</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};