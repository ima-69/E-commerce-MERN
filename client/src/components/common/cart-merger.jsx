import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mergeGuestCart } from "@/store/shop/cart-slice";
import { clearGuestCart } from "@/store/guest-cart-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";

const CartMerger = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { guestCartItems } = useSelector((state) => state.guestCart);
  const isMerging = useRef(false);
  const lastMergedCart = useRef(null);

  useEffect(() => {
    // Only merge if:
    // 1. User is authenticated
    // 2. User exists
    // 3. Guest cart has items
    // 4. Not currently merging
    // 5. Guest cart is different from last merged cart (prevents duplicate merges)
    const currentCartKey = guestCartItems?.map(item => `${item.productId}-${item.quantity}`).join(',');
    
    if (
      isAuthenticated && 
      user && 
      guestCartItems && 
      guestCartItems.length > 0 && 
      !isMerging.current &&
      currentCartKey !== lastMergedCart.current
    ) {
      const mergeCart = async () => {
        try {
          isMerging.current = true;
          lastMergedCart.current = currentCartKey;
          
          // Add a small delay to ensure user is fully authenticated
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await dispatch(mergeGuestCart({
            userId: user?.id || user?._id,
            guestCartItems: guestCartItems
          })).unwrap();

          // Clear guest cart after successful merge
          dispatch(clearGuestCart());
          
          // Fetch updated cart items
          dispatch(fetchCartItems(user?.id || user?._id));
          
          toast.success("Your cart items have been merged successfully!");
        } catch (error) {
          console.error("Failed to merge cart:", error);
          toast.error("Failed to merge cart items. Please try again.");
          // Reset merging flag and cart key on error so it can be retried
          isMerging.current = false;
          lastMergedCart.current = null;
        }
      };

      mergeCart();
    }
  }, [isAuthenticated, user, guestCartItems, dispatch]);

  // Reset merge state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      isMerging.current = false;
      lastMergedCart.current = null;
    }
  }, [isAuthenticated]);

  return null; // This component doesn't render anything
};

export default CartMerger;
