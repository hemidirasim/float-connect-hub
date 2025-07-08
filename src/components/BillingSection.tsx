
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditBalance } from './billing/CreditBalance';
import { CreditPackages } from './billing/CreditPackages';
import { CreditCostInfo } from './billing/CreditCostInfo';

interface UserCredits {
  balance: number;
  total_spent: number;
}

interface BillingSectionProps {
  userCredits: UserCredits;
  onCreditsUpdate: () => void;
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
];

declare global {
  interface Window {
    Paddle: any;
  }
}

export const BillingSection: React.FC<BillingSectionProps> = ({ userCredits, onCreditsUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializePaddle();
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

      console.log('🔧 Setting up Paddle for user:', user.email);

      // Initialize Paddle with latest API
      window.Paddle.Environment.set("production");
      window.Paddle.Initialize({
        token: "live_c780f029236977ad3ae72c25114",
        eventCallback: function(event: any) {
          console.log('🏓 Paddle event received:', {
            eventName: event.name,
            eventData: event.data,
            timestamp: new Date().toISOString()
          });
          
          if (event.name === "checkout.completed") {
            console.log('✅ Checkout completed, processing...');
            handleCheckoutCompleted(event.data);
          }
          
          if (event.name === "checkout.closed") {
            console.log('❌ Checkout closed');
            setLoading(false);
          }

          if (event.name === "checkout.error") {
            console.error('❌ Checkout error:', event.data);
            toast.error('Payment failed: ' + (event.data?.message || 'Unknown error'));
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
      console.log('💳 Processing checkout completion:', {
        transactionId: data.transaction_id,
        checkoutId: data.id,
        status: data.status,
        customer: data.customer,
        customData: data.custom_data,
        fullData: data
      });
      
      toast.success('Payment completed! Processing your credits...');
      
      // Add detailed logging for webhook data
      console.log('📊 Transaction details for webhook:', {
        id: data.transaction_id,
        customer_email: data.customer?.email,
        amount: data.totals?.total,
        custom_data: data.custom_data,
        items: data.items
      });
      
      // Wait for webhook processing with longer timeout
      setTimeout(async () => {
        console.log('🔄 Refreshing credits and transactions...');
        await onCreditsUpdate();
        
        // Check if transaction was processed
        const { data: recentTransactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('transaction_id', data.transaction_id)
          .maybeSingle();
          
        if (recentTransactions) {
          console.log('✅ Transaction found in database:', recentTransactions);
          toast.success(`Credits added successfully! +${recentTransactions.credits_added} credits`);
        } else {
          console.warn('⚠️ Transaction not found in database yet');
          toast.info('Payment processed, credits may take a few minutes to appear');
        }
      }, 8000); // Increased wait time for webhook processing
    } catch (error) {
      console.error('❌ Error handling checkout completion:', error);
      toast.error('Payment completed but there was an issue updating credits. Please refresh or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCredits = async () => {
    setRefreshing(true);
    try {
      await onCreditsUpdate();
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

      // Before opening checkout, cancel any existing subscriptions for this email
      try {
        await supabase.functions.invoke('customer-portal', {
          body: {
            action: 'cancel_existing_subscriptions',
            customer_email: user.email
          }
        });
      } catch (cancelError) {
        console.warn('Failed to cancel existing subscriptions:', cancelError);
        // Continue with purchase even if cancellation fails
      }

      // Open Paddle checkout with comprehensive custom data
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
          product_id: productId,
          user_email: user.email,
          package_price: price.toString(),
          timestamp: new Date().toISOString()
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

  return (
    <div className="space-y-6">
      <CreditBalance 
        userCredits={userCredits}
        onRefresh={handleRefreshCredits}
        refreshing={refreshing}
      />

      <CreditPackages
        creditPackages={creditPackages}
        onPurchase={handlePurchaseCredits}
        loading={loading}
        paddleLoaded={paddleLoaded}
      />

      <CreditCostInfo />
    </div>
  );
};
