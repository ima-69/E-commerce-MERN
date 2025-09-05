import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

const UserCartWrapper = ({ cartItems, setOpenCartSheet, isGuest = false }) => {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) => {
            // For guest cart, the price is in currentItem.product.price
            // For authenticated cart, the price is in currentItem.price
            const price = isGuest 
              ? (currentItem?.product?.salePrice > 0 
                  ? currentItem?.product?.salePrice 
                  : currentItem?.product?.price)
              : (currentItem?.salePrice > 0 
                  ? currentItem?.salePrice 
                  : currentItem?.price);
            
            return sum + price * currentItem?.quantity;
          },
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md p-4">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item, index) => (
              <UserCartItemsContent 
                key={item.productId || index} 
                cartItem={item} 
                isGuest={isGuest} 
              />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;