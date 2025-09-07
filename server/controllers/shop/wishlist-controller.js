const User = require("../../models/User");
const Product = require("../../models/Product");

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;
    const { productId } = req.body;

    // Sanitize and validate productId
    const sanitizedProductId = productId?.toString().trim();
    if (!sanitizedProductId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const product = await Product.findById(sanitizedProductId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(sanitizedProductId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Add product to wishlist
    user.wishlist.push(sanitizedProductId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;
    const { productId } = req.body;

    // Sanitize and validate productId
    const sanitizedProductId = productId?.toString().trim();
    if (!sanitizedProductId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product is in wishlist
    const productIndex = user.wishlist.indexOf(sanitizedProductId);
    if (productIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Product not in wishlist",
      });
    }

    // Remove product from wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).populate({
      path: "wishlist",
      model: "Product",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Check if product is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isInWishlist = user.wishlist.includes(productId);

    res.status(200).json({
      success: true,
      message: "Wishlist status retrieved successfully",
      data: { isInWishlist },
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus,
};
