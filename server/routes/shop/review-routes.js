const express = require("express");
const { authenticateToken } = require("../../middleware/auth");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", authenticateToken, addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;