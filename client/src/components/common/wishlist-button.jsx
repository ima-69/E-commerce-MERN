import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { toast } from "sonner";

const WishlistButton = ({ productId, className = "" }) => {
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
      variant="outline"
      size="sm"
      onClick={handleWishlistToggle}
      className={`flex items-center gap-2 ${className}`}
    >
      <Heart
        className={`h-4 w-4 ${
          isInWishlist 
            ? "fill-red-500 text-red-500" 
            : "text-gray-600"
        }`}
      />
      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  );
};

export default WishlistButton;
