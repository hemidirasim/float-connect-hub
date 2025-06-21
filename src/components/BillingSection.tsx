
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, History } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

export const BillingSection: React.FC<BillingSectionProps> = ({ userCredits, onCreditsUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handlePurchaseCredits = async (credits: number, price: number, productId: string) => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('Giriş etməlisiniz');
        return;
      }

      console.log('Creating checkout for:', { credits, price, productId });

      // Create Paddle checkout
      const { data, error } = await supabase.functions.invoke('paddle-checkout', {
        body: {
          productId,
          credits
        }
      });

      console.log('Checkout response:', data, error);

      if (error) {
        console.error('Checkout error:', error);
        throw new Error(error.message);
      }

      if (data.success) {
        // Open Paddle checkout in a new tab
        window.open(data.checkout_url, '_blank');
        toast.success('Ödəniş səhifəsi açıldı');
      } else {
        throw new Error(data.error || 'Checkout yaradılmadı');
      }

    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast.error('Kredit alınması zamanı xəta baş verdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Mövcud balans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{userCredits.balance}</div>
              <div className="text-sm text-gray-600">Mövcud kredit</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">{userCredits.total_spent}</div>
              <div className="text-sm text-gray-600">Xərclənmiş kredit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kredit paketləri</CardTitle>
          <CardDescription>Widget görüntülənmələri üçün kredit satın alın</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creditPackages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-2 left-4 bg-blue-600">Populyar</Badge>
                )}
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{pkg.credits}</div>
                  <div className="text-sm text-gray-600 mb-4">kredit</div>
                  <div className="text-xl font-semibold mb-4">${pkg.price}</div>
                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchaseCredits(pkg.credits, pkg.price, pkg.productId)}
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Satın al
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            Kredit qiyməti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Standart widget görüntülənmə</div>
                <div className="text-sm text-gray-600">Video olmayan widget-lər</div>
              </div>
              <Badge variant="outline">1 kredit</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium">Video widget görüntülənmə</div>
                <div className="text-sm text-gray-600">Video olan widget-lər</div>
              </div>
              <Badge variant="outline" className="text-purple-600">2 kredit</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
