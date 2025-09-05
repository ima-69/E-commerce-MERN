const Order = require("../../models/Order");
const User = require("../../models/User");
const { sendOrderStatusUpdateEmail } = require("../../helpers/emailService");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

const getAllOrdersOfAllUsers = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'firstName lastName email');

  if (!orders.length) {
    throw createError.notFound("No orders found!");
  }

  logger.info('All orders fetched for admin', { count: orders.length });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

const getOrderDetailsForAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate('userId', 'firstName lastName email');

  if (!order) {
    throw createError.notFound("Order not found!");
  }

  logger.info('Order details fetched for admin', { orderId: id });

  res.status(200).json({
    success: true,
    data: order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!orderStatus) {
    throw createError.badRequest("Order status is required");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw createError.notFound("Order not found!");
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });

  // Send order status update email
  try {
    const user = await User.findById(order.userId);
    if (user && user.email) {
      const emailResult = await sendOrderStatusUpdateEmail(
        user.email,
        user.userName || user.firstName || 'Customer',
        order,
        orderStatus
      );
      
      if (!emailResult.success) {
        logger.warn('Failed to send order status update email', {
          orderId: id,
          userId: order.userId,
          error: emailResult.error
        });
      }
    }
  } catch (emailError) {
    logger.warn('Error sending order status update email', {
      orderId: id,
      userId: order.userId,
      error: emailError.message
    });
    // Don't fail the status update if email fails
  }

  logger.info('Order status updated', { 
    orderId: id, 
    oldStatus: order.orderStatus, 
    newStatus: orderStatus 
  });

  res.status(200).json({
    success: true,
    message: "Order status is updated successfully!",
    data: updatedOrder,
  });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw createError.notFound("Order not found!");
  }

  await Order.findByIdAndDelete(id);

  logger.info('Order deleted by admin', { 
    orderId: id,
    userId: order.userId,
    totalAmount: order.totalAmount
  });

  res.status(200).json({
    success: true,
    message: "Order deleted successfully!",
    data: id,
  });
});

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
};