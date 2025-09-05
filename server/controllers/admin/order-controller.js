const Order = require("../../models/Order");
const User = require("../../models/User");
const { sendOrderStatusUpdateEmail } = require("../../helpers/emailService");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    // Send order status update email
    try {
      const user = await User.findById(order.userId);
      if (user && user.email) {
        console.log("Sending order status update email to:", user.email);
        const emailResult = await sendOrderStatusUpdateEmail(
          user.email,
          user.userName || user.firstName || 'Customer',
          order,
          orderStatus
        );
        
        if (emailResult.success) {
          console.log("Order status update email sent successfully");
        } else {
          console.error("Failed to send order status update email:", emailResult.error);
        }
      } else {
        console.log("User not found or no email address for order:", order._id);
      }
    } catch (emailError) {
      console.error("Error sending order status update email:", emailError);
      // Don't fail the status update if email fails
    }

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};