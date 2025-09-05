const express = require("express");
const { authenticateToken } = require("../../middleware/auth");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
  mergeGuestCart,
} = require("../../controllers/shop/cart-controller");
const { cartValidation, handleValidationErrors } = require("../../utils/validators");

const router = express.Router();

// Guest users can add to cart, authenticated users can add to cart
router.post("/add", cartValidation.addToCart, handleValidationErrors, addToCart);
// Only authenticated users can fetch their cart
router.get("/get/:userId", authenticateToken, cartValidation.getCart, handleValidationErrors, fetchCartItems);
// Only authenticated users can update cart
router.put("/update-cart", authenticateToken, cartValidation.updateQuantity, handleValidationErrors, updateCartItemQty);
// Only authenticated users can delete cart items
router.delete("/:userId/:productId", authenticateToken, cartValidation.deleteItem, handleValidationErrors, deleteCartItem);
// Only authenticated users can merge guest cart
router.post("/merge-guest-cart", authenticateToken, mergeGuestCart);

module.exports = router;