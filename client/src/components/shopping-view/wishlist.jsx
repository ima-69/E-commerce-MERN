import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeFromWishlist } from "@/store/shop/wishlist-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

const ShoppingWishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, loading } = useSelector((state) => state.shopWishlist);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, user?.id]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist({ 
        userId: user.id, 
        productId 
      })).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error || "Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (productId, totalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === productId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > totalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`); 
          return;
        }
      }
    }

    try {
      const result = await dispatch(
        addToCart({
          userId: user?.id,
          productId: productId,
          quantity: 1,
        })
      ).unwrap();

      if (result?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading wishlist...</div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-muted-foreground text-lg mb-2">Your wishlist is empty</div>
        <div className="text-sm text-muted-foreground">
          Add products to your wishlist by clicking the heart icon on any product
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Wishlist ({wishlistItems.length} items)</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map((product) => (
          <Card key={product._id} className="w-full max-w-sm mx-auto">
            <div className="relative">
              <img
                src={product?.image}
                alt={product?.title}
                className="w-full h-[200px] object-cover rounded-t-lg"
              />
              {product?.totalStock === 0 ? (
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                  Out Of Stock
                </Badge>
              ) : product?.totalStock < 10 ? (
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                  {`Only ${product?.totalStock} items left`}
                </Badge>
              ) : product?.salePrice > 0 ? (
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                  Sale
                </Badge>
              ) : null}
            </div>
            
            <CardContent className="p-4">
              <h4 className="text-lg font-bold mb-2 line-clamp-2">{product?.title}</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {categoryOptionsMap[product?.category]} 
                </span>
                <span className="text-sm text-muted-foreground">
                  {brandOptionsMap[product?.brand]}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`${
                    product?.salePrice > 0 ? "line-through" : ""
                  } text-lg font-semibold text-primary`}
                >
                  ${product?.price}
                </span>
                {product?.salePrice > 0 ? (
                  <span className="text-lg font-semibold text-primary">
                    ${product?.salePrice}
                  </span>
                ) : null}
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex gap-2">
              {product?.totalStock === 0 ? (
                <Button className="flex-1 opacity-60 cursor-not-allowed">
                  Out Of Stock
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddToCart(product._id, product.totalStock)}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveFromWishlist(product._id)}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShoppingWishlist;
