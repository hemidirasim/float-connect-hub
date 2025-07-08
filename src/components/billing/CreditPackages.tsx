
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';

interface CreditPackage {
  credits: number;
  price: number;
  productId: string;
  popular: boolean;
}

interface CreditPackagesProps {
  creditPackages: CreditPackage[];
  onPurchase: (credits: number, price: number, productId: string) => void;
  loading: boolean;
  paddleLoaded: boolean;
}

export const CreditPackages: React.FC<CreditPackagesProps> = ({
  creditPackages,
  onPurchase,
  loading,
  paddleLoaded
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit packages</CardTitle>
        <CardDescription>Buy credits for widget views</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  onClick={() => onPurchase(pkg.credits, pkg.price, pkg.productId)}
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
      </CardContent>
    </Card>
  );
};
