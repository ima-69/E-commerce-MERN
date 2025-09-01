import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mergeGuestCart } from "@/store/shop/cart-slice";
import { clearGuestCart } from "@/store/guest-cart-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";

const CartMerger = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { guestCartItems } = useSelector((state) => state.guestCart);

  useEffect(() => {
    // Only merge if user just logged in and has guest cart items
    if (isAuthenticated && user && guestCartItems && guestCartItems.length > 0) {
      const mergeCart = async () => {
        try {
          await dispatch(mergeGuestCart({
            userId: user.id,
            guestCartItems: guestCartItems
          })).unwrap();

          // Clear guest cart after successful merge
          dispatch(clearGuestCart());
          
          // Fetch updated cart items
          dispatch(fetchCartItems(user.id));
          
          toast.success("Your cart items have been merged successfully!");
        } catch (error) {
          console.error("Failed to merge cart:", error);
          toast.error("Failed to merge cart items. Please try again.");
        }
      };

      mergeCart();
    }
  }, [isAuthenticated, user, guestCartItems, dispatch]);

  return null; // This component doesn't render anything
};

export default CartMerger;
