const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const { sendOrderConfirmationEmail } = require("../../helpers/emailService");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

const createOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    cartItems,
    addressInfo,
    orderStatus,
    paymentMethod,
    paymentStatus,
    totalAmount,
    orderDate,
    orderUpdateDate,
    purchaseDate,
    preferredDeliveryTime,
    receivingDate,
    paymentId,
    payerId,
    cartId,
  } = req.body;

  // Validate required fields
  if (!userId || !cartItems || !addressInfo || !totalAmount) {
    throw createError.badRequest("Missing required order information");
  }

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${process.env.VITE_FRONTEND_URL}/shop/paypal-return`,
      cancel_url: `${process.env.VITE_FRONTEND_URL}/shop/paypal-cancel`,
    },
    transactions: [
      {
        item_list: {
          items: cartItems.map((item) => ({
            name: item.title,
            sku: item.productId,
            price: item.price.toFixed(2),
            currency: "USD",
            quantity: item.quantity,
          })),
        },
        amount: {
          currency: "USD",
          total: totalAmount.toFixed(2),
        },
        description: "description",
      },
    ],
  };

  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        logger.error("Error creating PayPal payment", { error: error.message, userId });
        reject(createError.serverError("Error while creating PayPal payment"));
        return;
      }

      try {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          purchaseDate,
          preferredDeliveryTime,
          receivingDate,
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        logger.info('Order created successfully', { 
          orderId: newlyCreatedOrder._id, 
          userId, 
          totalAmount 
        });

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
        resolve();
      } catch (dbError) {
        logger.error("Database error creating order", { error: dbError.message, userId });
        reject(createError.serverError("Failed to save order"));
      }
    });
  });
});

const capturePayment = asyncHandler(async (req, res) => {
  const { paymentId, payerId, orderId } = req.body;

  if (!paymentId || !payerId || !orderId) {
    throw createError.badRequest("Payment ID, Payer ID, and Order ID are required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw createError.notFound("Order not found");
  }

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.paymentId = paymentId;
  order.payerId = payerId;

  // Update product stock
  for (let item of order.cartItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw createError.notFound(`Product not found: ${item.productId}`);
    }

    if (product.totalStock < item.quantity) {
      throw createError.badRequest(`Insufficient stock for product: ${product.title}`);
    }

    product.totalStock -= item.quantity;
    await product.save();
  }

  // Clear cart after successful payment
  if (order.cartId) {
    await Cart.findByIdAndDelete(order.cartId);
  }

  await order.save();

  // Send order confirmation email
  try {
    const user = await User.findById(order.userId);
    
    if (user && user.email) {
      const emailResult = await sendOrderConfirmationEmail(
        user.email,
        user.userName || user.firstName || 'Customer',
        order
      );
      
      if (!emailResult.success) {
        logger.warn("Failed to send order confirmation email", { 
          orderId, 
          userId: order.userId, 
          error: emailResult.error 
        });
      }
    }
  } catch (emailError) {
    logger.warn("Error sending order confirmation email", { 
      orderId, 
      userId: order.userId, 
      error: emailError.message 
    });
    // Don't fail the order if email fails
  }

  logger.info('Payment captured successfully', { 
    orderId, 
    userId: order.userId, 
    paymentId, 
    totalAmount: order.totalAmount 
  });

  res.status(200).json({
    success: true,
    message: "Order confirmed",
    data: order,
  });
});

const getAllOrdersByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw createError.badRequest("User ID is required");
  }

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  logger.info('Orders fetched for user', { userId, count: orders.length });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw createError.notFound("Order not found");
  }

  logger.info('Order details fetched', { orderId: id, userId: order.userId });

  res.status(200).json({
    success: true,
    data: order,
  });
});

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};