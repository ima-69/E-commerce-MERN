const express = require("express");
const { authenticateToken } = require("../../middleware/auth");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
} = require("../../controllers/shop/wishlist-controller");

// Add product to wishlist - requires authentication
router.post("/add", authenticateToken, addToWishlist);

// Remove product from wishlist - requires authentication
router.post("/remove", authenticateToken, removeFromWishlist);

// Get user's wishlist - requires authentication
router.get("/:userId", authenticateToken, getWishlist);

// Check if product is in wishlist - requires authentication
router.get("/status/:userId/:productId", authenticateToken, checkWishlistStatus);

module.exports = router;
