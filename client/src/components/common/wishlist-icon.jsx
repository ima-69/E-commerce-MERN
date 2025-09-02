import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { toast } from "sonner";

const WishlistIcon = ({ productId, className = "" }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { wishlistStatus } = useSelector((state) => state.shopWishlist);

  // Check if product is in wishlist
  const isInWishlist = wishlistStatus[productId] || false;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist({ 
          userId: user.id, 
          productId 
        })).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ 
          userId: user.id, 
          productId 
        })).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error || "Failed to update wishlist");
    }
  };

  // Don't render for non-authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleWishlistToggle}
      className={`absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/80 transition-colors ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          isInWishlist 
            ? "fill-red-500 text-red-500" 
            : "text-gray-600 hover:text-red-500"
        }`}
      />
    </Button>
  );
};

export default WishlistIcon;
