import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CalendarIcon, ClockIcon, CheckCircleIcon } from "lucide-react";
import { formatDeliveryDate, getDayName } from "@/lib/delivery-utils";

const DeliveryConfirmation = ({ 
  isOpen, 
  onClose, 
  onContinueShopping,
  purchaseDate, 
  preferredDeliveryTime, 
  orderId 
}) => {
  const receivingDate = purchaseDate ? new Date(purchaseDate) : null;
  
  // If purchase date is Sunday, move to Monday
  if (receivingDate && receivingDate.getDay() === 0) {
    receivingDate.setDate(receivingDate.getDate() + 1);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            Payment Successful!
          </DialogTitle>
          <DialogDescription>
            Your payment has been processed successfully. Your order is confirmed and here are your delivery details:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order ID */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-lg">{orderId}</p>
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
            <Button onClick={onClose} className="flex-1">
              View My Orders
            </Button>
            <Button onClick={onContinueShopping} variant="outline" className="flex-1">
              Continue Shopping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryConfirmation;
