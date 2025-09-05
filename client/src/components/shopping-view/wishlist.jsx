import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { ShoppingCart, Trash2, Heart, Star } from "lucide-react";
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
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gray-200 rounded-lg">
                <Heart className="h-5 w-5 text-gray-600" />
              </div>
              My Wishlist
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your saved favorite items
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading wishlist...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gray-200 rounded-lg">
                <Heart className="h-5 w-5 text-gray-600" />
              </div>
              My Wishlist
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your saved favorite items
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600">Add products to your wishlist by clicking the heart icon on any product</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Heart className="h-5 w-5 text-gray-600" />
            </div>
            My Wishlist
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your saved favorite items ({wishlistItems.length} items)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <Card key={product._id} className="group hover:shadow-lg transition-shadow duration-200">
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
                    <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
                      {`Only ${product?.totalStock} left`}
                    </Badge>
                  ) : product?.salePrice > 0 ? (
                    <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                      Sale
                    </Badge>
                  ) : null}
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <h4 className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product?.title}
                  </h4>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {categoryOptionsMap[product?.category]} 
                    </span>
                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {brandOptionsMap[product?.brand]}
                    </span>
                  </div>

                  {/* Rating (Mock) */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        product?.salePrice > 0 ? "line-through text-gray-400 text-sm" : ""
                      } text-lg font-semibold text-gray-900`}
                    >
                      ${product?.price}
                    </span>
                    {product?.salePrice > 0 && (
                      <span className="text-lg font-semibold text-green-600">
                        ${product?.salePrice}
                      </span>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  {product?.totalStock === 0 ? (
                    <Button className="flex-1 opacity-60 cursor-not-allowed" disabled>
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
                    className="shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingWishlist;
