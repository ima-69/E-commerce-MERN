const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

const addToCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || quantity <= 0) {
    throw createError.badRequest("Invalid data provided!");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw createError.notFound("Product not found");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    cart.items.push({ productId, quantity });
  } else {
    cart.items[findCurrentProductIndex].quantity += quantity;
  }

  await cart.save();
  
  logger.info('Item added to cart', { userId, productId, quantity });
  
  res.status(200).json({
    success: true,
    data: cart,
  });
});

const fetchCartItems = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw createError.badRequest("User id is mandatory!");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) {
    // Return empty cart instead of 404
    return res.status(200).json({
      success: true,
      data: {
        _id: null,
        userId: userId,
        items: [],
      },
    });
  }

  const validItems = cart.items.filter(
    (productItem) => productItem.productId
  );

  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await cart.save();
    logger.info('Cleaned invalid items from cart', { userId, removedCount: cart.items.length - validItems.length });
  }

  const populateCartItems = validItems.map((item) => ({
    productId: item.productId._id,
    image: item.productId.image,
    title: item.productId.title,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
    quantity: item.quantity,
  }));

  res.status(200).json({
    success: true,
    data: {
      ...cart._doc,
      items: populateCartItems,
    },
  });
});

const updateCartItemQty = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || quantity <= 0) {
    throw createError.badRequest("Invalid data provided!");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw createError.notFound("Cart not found!");
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    throw createError.notFound("Cart item not present!");
  }

  cart.items[findCurrentProductIndex].quantity = quantity;
  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const populateCartItems = cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.image : null,
    title: item.productId ? item.productId.title : "Product not found",
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    quantity: item.quantity,
  }));

  logger.info('Cart item quantity updated', { userId, productId, quantity });

  res.status(200).json({
    success: true,
    data: {
      ...cart._doc,
      items: populateCartItems,
    },
  });
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  if (!userId || !productId) {
    throw createError.badRequest("Invalid data provided!");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) {
    throw createError.notFound("Cart not found!");
  }

  const initialItemCount = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.productId._id.toString() !== productId
  );

  if (cart.items.length === initialItemCount) {
    throw createError.notFound("Cart item not found!");
  }

  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const populateCartItems = cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.image : null,
    title: item.productId ? item.productId.title : "Product not found",
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    quantity: item.quantity,
  }));

  logger.info('Cart item deleted', { userId, productId });

  res.status(200).json({
    success: true,
    data: {
      ...cart._doc,
      items: populateCartItems,
    },
  });
});

const mergeGuestCart = asyncHandler(async (req, res) => {
  const { userId, guestCartItems } = req.body;

  if (!userId || !guestCartItems || !Array.isArray(guestCartItems)) {
    throw createError.badRequest("Invalid data provided!");
  }

  // Get or create user cart
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // Create a map to track processed items and avoid duplicates
  const processedItems = new Map();
  let mergedItemsCount = 0;

  // Merge guest cart items with user cart
  for (const guestItem of guestCartItems) {
    const { productId, quantity } = guestItem;

    // Skip if we've already processed this item in this request
    if (processedItems.has(productId)) {
      continue;
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      logger.warn('Skipping invalid product during cart merge', { productId, userId });
      continue; // Skip invalid products
    }

    // Mark as processed
    processedItems.set(productId, true);

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex === -1) {
      // Add new item
      cart.items.push({ productId, quantity });
    } else {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    }
    
    mergedItemsCount++;
  }

  await cart.save();

  // Populate and return the updated cart
  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const populateCartItems = cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.image : null,
    title: item.productId ? item.productId.title : "Product not found",
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    quantity: item.quantity,
  }));

  logger.info('Guest cart merged with user cart', { 
    userId, 
    guestItemsCount: guestCartItems.length, 
    mergedItemsCount 
  });

  res.status(200).json({
    success: true,
    data: {
      ...cart._doc,
      items: populateCartItems,
    },
  });
});

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
  mergeGuestCart,
};