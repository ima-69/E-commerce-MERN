const express = require("express");
const { authenticateToken } = require("../../middleware/auth");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
  mergeGuestCart,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

// Guest users can add to cart, authenticated users can add to cart
router.post("/add", addToCart);
// Only authenticated users can fetch their cart
router.get("/get/:userId", authenticateToken, fetchCartItems);
// Only authenticated users can update cart
router.put("/update-cart", authenticateToken, updateCartItemQty);
// Only authenticated users can delete cart items
router.delete("/:userId/:productId", authenticateToken, deleteCartItem);
// Only authenticated users can merge guest cart
router.post("/merge-guest-cart", authenticateToken, mergeGuestCart);

module.exports = router;