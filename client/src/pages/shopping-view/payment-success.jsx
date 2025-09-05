import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate("/shop/account?tab=orders");
  };

  const handleContinueShopping = () => {
    navigate("/shop/listing");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your order has been confirmed and will be processed shortly.
          </CardDescription>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleViewOrders}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <Package className="h-5 w-5" />
            View Your Orders
          </Button>
          
          <Button 
            onClick={handleContinueShopping}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;