const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
} = require("../../controllers/shop/wishlist-controller");

// Add product to wishlist
router.post("/add", addToWishlist);

// Remove product from wishlist
router.post("/remove", removeFromWishlist);

// Get user's wishlist
router.get("/:userId", getWishlist);

// Check if product is in wishlist
router.get("/status/:userId/:productId", checkWishlistStatus);

module.exports = router;
