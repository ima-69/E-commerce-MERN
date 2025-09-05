import CheckoutAddress from "@/components/shopping-view/checkout-address";
import DeliverySchedule from "@/components/shopping-view/delivery-schedule";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { calculateReceivingDate } from "@/lib/delivery-utils";

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { guestCartItems } = useSelector((state) => state.guestCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [preferredDeliveryTime, setPreferredDeliveryTime] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // Redirect guest users to login
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to proceed with checkout. Your cart items will be preserved.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate("/auth/login?redirect=/shop/checkout")} variant="default">
              Login
            </Button>
            <Button onClick={() => navigate("/auth/register")} variant="outline">
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const handleInitiatePaypalPayment = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to cart.");

      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select one address to proceed.");

      return;
    }
    if (!purchaseDate) {
      toast.error("Please select a purchase date.");

      return;
    }
    if (!preferredDeliveryTime) {
      toast.error("Please select a preferred delivery time.");

      return;
    }

    // Check if selected date is Sunday
    const selectedDate = new Date(purchaseDate);
    if (selectedDate.getDay() === 0) {
      toast.error("Sundays are not available for delivery. Please select another date.");
      return;
    }

    // Check if selected date is within 2 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(today.getDate() + 2);
    
    if (selectedDate < minDeliveryDate) {
      const minDateString = minDeliveryDate.toISOString().split('T')[0];
      toast.error(`Minimum delivery time is 2 days. Please select a date on or after ${minDateString}.`);
      return;
    }

    // Calculate receiving date (move Sunday to Monday)
    const receivingDate = calculateReceivingDate(purchaseDate, preferredDeliveryTime);

    const orderData = {
      userId: user?.id || user?._id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      purchaseDate: purchaseDate,
      preferredDeliveryTime: preferredDeliveryTime,
      receivingDate: receivingDate,
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
        
        // Store delivery details in sessionStorage for PayPal return page
        sessionStorage.setItem("purchaseDate", purchaseDate);
        sessionStorage.setItem("preferredDeliveryTime", preferredDeliveryTime);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 p-5">
        <div className="space-y-5">
          <DeliverySchedule
            purchaseDate={purchaseDate}
            setPurchaseDate={setPurchaseDate}
            preferredDeliveryTime={preferredDeliveryTime}
            setPreferredDeliveryTime={setPreferredDeliveryTime}
          />
          <CheckoutAddress
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;