import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Order Details</DialogTitle>
      <DialogDescription>
        View detailed information about your order
      </DialogDescription>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Purchase Date</p>
            <Label>{orderDetails?.purchaseDate ? new Date(orderDetails.purchaseDate).toLocaleDateString() : "Not specified"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Preferred Delivery Time</p>
            <Label>{orderDetails?.preferredDeliveryTime || "Not specified"}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Receiving Date</p>
            <Label>{orderDetails?.receivingDate ? new Date(orderDetails.receivingDate).toLocaleDateString() : "Not specified"}</Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Items</div>
            <div className="space-y-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.price}</div>
                        <div className="text-sm text-gray-600">Total: ${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                : <div className="text-gray-500">No items found</div>}
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-lg font-bold">Order Total:</span>
              <span className="text-lg font-bold">${orderDetails?.totalAmount}</span>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName || user?.firstName + ' ' + user?.lastName || 'User'}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;