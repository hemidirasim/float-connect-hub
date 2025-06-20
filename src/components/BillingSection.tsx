
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  { credits: 100, price: 5, popular: false },
  { credits: 500, price: 20, popular: true },
  { credits: 1000, price: 35, popular: false },
  { credits: 2500, price: 80, popular: false },
];

export const BillingSection: React.FC<BillingSectionProps> = ({ userCredits, onCreditsUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handlePurchaseCredits = async (credits: number, price: number) => {
    setLoading(true);
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from('user_credits')
        .update({ 
          balance: userCredits.balance + credits,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast.success(`${credits} kredit uğurla əlavə edildi!`);
      onCreditsUpdate();
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast.error('Kredit alınması zamanı xəta baş verdi');
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    onClick={() => handlePurchaseCredits(pkg.credits, pkg.price)}
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
