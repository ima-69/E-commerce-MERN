import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
import { updateGuestCartQuantity, removeFromGuestCart } from "@/store/guest-cart-slice";
import { toast } from "sonner";


const UserCartItemsContent = ({ cartItem, isGuest = false }) => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (getCartItem, typeOfAction) => {
    if (isGuest) {
      // Handle guest cart quantity update
      const newQuantity = typeOfAction === "plus" 
        ? getCartItem?.quantity + 1 
        : getCartItem?.quantity - 1;

      // Check stock limit for guest cart
      if (typeOfAction === "plus") {
        const product = getCartItem?.product;
        if (product && newQuantity > product.totalStock) {
          toast.error(`Only ${product.totalStock} quantity can be added for this item`);
          return;
        }
      }

      dispatch(updateGuestCartQuantity({
        productId: getCartItem?.productId,
        quantity: newQuantity
      }));
      toast.success("Cart item is updated successfully");
    } else {
      // Handle authenticated user cart quantity update
      if (typeOfAction == "plus") {
        let getCartItems = cartItems.items || [];

        if (getCartItems.length) {
          const indexOfCurrentCartItem = getCartItems.findIndex(
            (item) => item.productId === getCartItem?.productId
          );

          const getCurrentProductIndex = productList.findIndex(
            (product) => product._id === getCartItem?.productId
          );
          const getTotalStock = productList[getCurrentProductIndex].totalStock;


          if (indexOfCurrentCartItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
            if (getQuantity + 1 > getTotalStock) {
              toast.error(`Only ${getTotalStock} quantity can be added for this item`);
              return;
            }
          }
        }
      }

      dispatch(
        updateCartQuantity({
          userId: user?.id || user?._id,
          productId: getCartItem?.productId,
          quantity:
            typeOfAction === "plus"
              ? getCartItem?.quantity + 1
              : getCartItem?.quantity - 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          // Refresh cart items after successful update
          dispatch(fetchCartItems(user?.id || user?._id));
          toast.success("Cart item is updated successfully");
        } else {
          toast.error("Failed to update cart item");
        }
      }).catch((error) => {
        console.error("Error updating cart item:", error);
        toast.error("Failed to update cart item");
      });
    }
  }

  const handleCartItemDelete = (getCartItem) => {
    if (isGuest) {
      // Handle guest cart item deletion
      dispatch(removeFromGuestCart({
        productId: getCartItem?.productId
      }));
      toast.success("Cart item is deleted successfully");
    } else {
      // Handle authenticated user cart item deletion
      dispatch(
        deleteCartItem({ userId: user?.id || user?._id, productId: getCartItem?.productId })
      ).then((data) => {
        if (data?.payload?.success) {
          // Refresh cart items after successful deletion
          dispatch(fetchCartItems(user?.id || user?._id));
          toast.success("Cart item is deleted successfully");
        } else {
          toast.error("Failed to delete cart item");
        }
      }).catch((error) => {
        console.error("Error deleting cart item:", error);
        toast.error("Failed to delete cart item");
      });
    }
  }

  // Get the correct data based on guest or authenticated user
  const itemImage = isGuest ? cartItem?.product?.image : cartItem?.image;
  const itemTitle = isGuest ? cartItem?.product?.title : cartItem?.title;
  const itemPrice = isGuest 
    ? (cartItem?.product?.salePrice > 0 ? cartItem?.product?.salePrice : cartItem?.product?.price)
    : (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price);

  return (
    <div className="flex items-center space-x-4"> 
      <img
        src={itemImage}
        alt={itemTitle}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{itemTitle}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${(itemPrice * cartItem?.quantity).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;