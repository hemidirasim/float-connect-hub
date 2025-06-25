import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, History, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserCredits {
  balance: number;
  total_spent: number;
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

interface BillingSectionProps {
  userCredits: UserCredits;
  onCreditsUpdate: () => void;
}

const creditPackages = [
  { 
    credits: 10, 
    price: 1, 
    productId: 'pri_01jygks56v6vpvncqxn5harqae',
    popular: false 
  },
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
];

declare global {
  interface Window {
    Paddle: any;
  }
}

export const BillingSection: React.FC<BillingSectionProps> = ({ userCredits, onCreditsUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializePaddle();
    fetchTransactions();
  }, []);

  const initializePaddle = async () => {
    try {
      // Load Paddle script if not already loaded
      if (!window.Paddle) {
        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
        script.async = true;
        
        script.onload = () => {
          setupPaddle();
        };
        
        script.onerror = () => {
          console.error('Failed to load Paddle script');
          toast.error('Payment system failed to load');
        };
        
        document.head.appendChild(script);
      } else {
        setupPaddle();
      }
    } catch (error) {
      console.error('Error initializing Paddle:', error);
      toast.error('Failed to initialize payment system');
    }
  };

  const setupPaddle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Setting up Paddle for user:', user.email);

      // Initialize Paddle with latest API
      window.Paddle.Environment.set("production");
      window.Paddle.Initialize({
        token: "live_c780f029236977ad3ae72c25114",
        eventCallback: function(event: any) {
          console.log('🏓 Paddle event:', event);
          
          if (event.name === "checkout.completed") {
            handleCheckoutCompleted(event.data);
          }
          
          if (event.name === "checkout.closed") {
            setLoading(false);
          }
        }
      });

      setPaddleLoaded(true);
      console.log('✅ Paddle initialized successfully');
    } catch (error) {
      console.error('❌ Paddle setup error:', error);
      toast.error('Failed to setup payment system');
    }
  };

  const handleCheckoutCompleted = async (data: any) => {
    try {
      console.log('✅ Checkout completed:', data);
      toast.success('Payment completed! Processing your credits...');
      
      // Wait for webhook processing
      setTimeout(async () => {
        await onCreditsUpdate();
        await fetchTransactions();
        toast.success('Credits added successfully!');
      }, 5000); // Increased wait time for webhook processing
    } catch (error) {
      console.error('Error handling checkout completion:', error);
      toast.error('Payment completed but there was an issue updating credits. Please refresh or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTransactions(data || []);
      console.log('Transactions loaded:', data?.length || 0);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      toast.error('Failed to load transaction history');
    }
  };

  const handleRefreshCredits = async () => {
    setRefreshing(true);
    try {
      await onCreditsUpdate();
      await fetchTransactions();
      toast.success('Credits refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing credits:', error);
      toast.error('Failed to refresh credits');
    } finally {
      setRefreshing(false);
    }
  };

  const handlePurchaseCredits = async (credits: number, price: number, productId: string) => {
    if (!paddleLoaded || !window.Paddle) {
      toast.error('Payment system is still loading, please wait...');
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('Please log in to purchase credits');
        setLoading(false);
        return;
      }

      console.log('🛒 Opening Paddle checkout:', { 
        credits, 
        price, 
        productId, 
        userEmail: user.email 
      });

      // Open Paddle checkout with latest API format
      window.Paddle.Checkout.open({
        items: [{
          priceId: productId,
          quantity: 1
        }],
        customer: {
          email: user.email
        },
        customData: {
          user_id: user.id,
          credits: credits.toString(),
          user_email: user.email,
          product_id: productId
        },
        settings: {
          theme: "light",
          displayMode: "overlay",
          allowLogout: false
        }
      });

    } catch (error: any) {
      console.error('❌ Error opening checkout:', error);
      toast.error('Failed to open payment page: ' + error.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Balance
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefreshCredits}
              disabled={refreshing}
              className="ml-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
        <CardHeader>
          <CardTitle>Credit packages</CardTitle>
          <CardDescription>Buy credits for widget views</CardDescription>
        </CardHeader>
        <CardContent>
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
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Payment Processing
            </h4>
            <p className="text-sm text-blue-700 mb-2">
              After successful payment:
            </p>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Wait 3-5 minutes for processing</li>
              <li>Click "Refresh" button to update credits</li>
              <li>Check transaction history below</li>
              <li>Contact support if credits don't appear within 10 minutes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{transaction.credits_purchased} credits</div>
                    <div className="text-sm text-gray-600">{formatDate(transaction.created_at)}</div>
                    <div className="text-xs text-gray-500">ID: {transaction.paddle_transaction_id}</div>
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
            <div className="text-center py-4 text-gray-500">
              No transaction history available
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