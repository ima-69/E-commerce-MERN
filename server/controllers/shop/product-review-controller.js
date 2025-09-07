const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;
    const { productId, userName, reviewMessage, reviewValue } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      productId: productId?.toString().trim(),
      userName: userName?.toString().trim(),
      reviewMessage: reviewMessage?.toString().trim(),
      reviewValue: parseInt(reviewValue) || 0
    };

    // Validate required fields
    if (!sanitizedData.productId || !sanitizedData.reviewMessage || sanitizedData.reviewValue < 1 || sanitizedData.reviewValue > 5) {
      return res.status(400).json({
        success: false,
        message: "Product ID, review message, and valid rating (1-5) are required",
      });
    }

    const order = await Order.findOne({
      userId,
      "cartItems.productId": sanitizedData.productId,
      // orderStatus: "confirmed" || "delivered",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const checkExistingReview = await ProductReview.findOne({
      productId: sanitizedData.productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId: sanitizedData.productId,
      userId,
      userName: sanitizedData.userName,
      reviewMessage: sanitizedData.reviewMessage,
      reviewValue: sanitizedData.reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId: sanitizedData.productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(sanitizedData.productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.error("Error adding product review:", e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };