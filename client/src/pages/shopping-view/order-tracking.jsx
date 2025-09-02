import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock tracking data - in real app, this would come from API
  const mockTrackingData = {
    orderId: "ORD-2024-001",
    status: "shipped",
    estimatedDelivery: "2024-01-15",
    trackingNumber: "TRK123456789",
    carrier: "FedEx",
    timeline: [
      {
        status: "ordered",
        date: "2024-01-10",
        time: "10:30 AM",
        description: "Order placed successfully",
        completed: true
      },
      {
        status: "confirmed",
        date: "2024-01-10",
        time: "11:15 AM",
        description: "Order confirmed and payment processed",
        completed: true
      },
      {
        status: "processing",
        date: "2024-01-11",
        time: "09:00 AM",
        description: "Order is being prepared for shipment",
        completed: true
      },
      {
        status: "shipped",
        date: "2024-01-12",
        time: "02:30 PM",
        description: "Order has been shipped",
        completed: true
      },
      {
        status: "delivered",
        date: "2024-01-15",
        time: "Expected",
        description: "Out for delivery",
        completed: false
      }
    ]
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingData(mockTrackingData);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ordered":
      case "confirmed":
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-yellow-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ordered":
        return "Ordered";
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600">Enter your order ID to track your package</p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <Input
              type="text"
              placeholder="Enter your order ID (e.g., ORD-2024-001)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Tracking..." : "Track Order"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{trackingData.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(trackingData.status)}>
                    {getStatusText(trackingData.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-semibold">{trackingData.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carrier</p>
                  <p className="font-semibold">{trackingData.carrier}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingData.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed ? getStatusColor(item.status) : 'bg-gray-300'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-white" />
                        )}
                      </div>
                      {index < trackingData.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${
                          item.completed ? 'bg-gray-300' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{getStatusText(item.status)}</h4>
                        <Badge variant="outline" className="text-xs">
                          {item.date}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Can't find your order or having trouble tracking? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline">
              Contact Support
            </Button>
            <Button variant="outline">
              View Order History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTracking;
