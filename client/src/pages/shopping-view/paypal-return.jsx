import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { formatDeliveryDate, getDayName } from "@/lib/delivery-utils";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  
  const [paymentStatus, setPaymentStatus] = useState("processing"); // processing, success, error
  const [orderDetails, setOrderDetails] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState("");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      const storedPurchaseDate = sessionStorage.getItem("purchaseDate");
      const storedDeliveryTime = sessionStorage.getItem("preferredDeliveryTime");

      setPurchaseDate(storedPurchaseDate || "");
      setPreferredDeliveryTime(storedDeliveryTime || "");

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          setPaymentStatus("success");
          setOrderDetails(data?.payload?.data);
          sessionStorage.removeItem("currentOrderId");
          sessionStorage.removeItem("purchaseDate");
          sessionStorage.removeItem("preferredDeliveryTime");
        } else {
          setPaymentStatus("error");
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  const receivingDate = purchaseDate ? new Date(purchaseDate) : null;
  
  // If purchase date is Sunday, move to Monday
  if (receivingDate && receivingDate.getDay() === 0) {
    receivingDate.setDate(receivingDate.getDate() + 1);
  }

  if (paymentStatus === "processing") {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              Processing Payment...Please wait!
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              There was an error processing your payment. Please try again.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/shop/checkout")}>
                Try Again
              </Button>
              <Button onClick={() => navigate("/shop/home")} variant="outline">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircleIcon className="h-6 w-6" />
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Your payment has been processed successfully. Your order is confirmed and here are your delivery details:
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-lg">{orderDetails?._id || "N/A"}</p>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Delivery Information</h3>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Delivery Date</p>
                <p className="font-semibold">
                  {receivingDate ? formatDeliveryDate(receivingDate) : "Not specified"}
                </p>
                {receivingDate && getDayName(receivingDate) === "Monday" && (
                  <p className="text-xs text-blue-600 mt-1">
                    *Originally scheduled for Sunday, moved to Monday
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <ClockIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Delivery Time</p>
                <p className="font-semibold">{preferredDeliveryTime || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Please ensure someone is available at the delivery address</li>
              <li>• We'll contact you before delivery</li>
              <li>• Delivery times are approximate and may vary</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => navigate("/shop/account?tab=orders")} 
              className="flex-1"
            >
              View My Orders
            </Button>
            <Button 
              onClick={() => navigate("/shop/home")} 
              variant="outline" 
              className="flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaypalReturnPage;