import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { addToGuestCart } from "@/store/guest-cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const SearchProducts = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  
  // Get search query from URL parameter
  const searchQuery = searchParams.get('q') || '';
  
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== "" && searchQuery.trim().length > 0) {
      dispatch(getSearchResults(searchQuery));
    } else {
      dispatch(resetSearchResults());
    }
  }, [searchQuery, dispatch]);

  const handleAddtoCart = (getCurrentProductId, getTotalStock) => {
    if (!isAuthenticated) {
      // Handle guest cart
      const product = searchResults.find(p => p._id === getCurrentProductId);
      if (product) {
        dispatch(addToGuestCart({
          productId: getCurrentProductId,
          quantity: 1,
          product: product
        }));
        toast.success("Product is added to cart");
      }
    } else {
      // Handle authenticated user cart
      console.log(cartItems);
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex(
          (item) => item.productId === getCurrentProductId
        );
        if (indexOfCurrentItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast.error(`Only ${getQuantity} quantity can be added for this item`);
            return;
          }
        }
      }

      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Product is added to cart");
        }
      });
    }
  }

  const handleGetProductDetails = (getCurrentProductId) => {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {searchQuery && (
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            Search Results for: "{searchQuery}"
          </h1>
        </div>
      )}
      {!searchResults.length && searchQuery ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      {!searchQuery && (
        <h1 className="text-5xl font-extrabold">Search for products using the search bar above</h1>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;