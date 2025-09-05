const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const { sendOrderConfirmationEmail } = require("../../helpers/emailService");

const createOrder = async (req, res) => {
  try {
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
      paymentId,
      payerId,
      cartId,
    } = req.body;

    console.log("Creating order with userId:", userId);
    console.log("Order data:", {
      userId,
      cartItems: cartItems?.length,
      totalAmount,
      orderStatus
    });

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

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
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
          paymentId,
          payerId,
        });

        await newlyCreatedOrder.save();
        console.log("Order created successfully:", newlyCreatedOrder._id);
        console.log("Order userId:", newlyCreatedOrder.userId);
        console.log("Order data:", {
          userId: newlyCreatedOrder.userId,
          orderStatus: newlyCreatedOrder.orderStatus,
          totalAmount: newlyCreatedOrder.totalAmount,
          orderDate: newlyCreatedOrder.orderDate
        });

        // Verify the order was saved by fetching it
        const savedOrder = await Order.findById(newlyCreatedOrder._id);
        console.log("Verified saved order:", savedOrder ? "Found" : "Not found");

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();
    console.log("Order updated successfully:", order._id);

    // Send order confirmation email
    try {
      console.log("=== EMAIL DEBUG START ===");
      console.log("Order userId:", order.userId);
      
      const user = await User.findById(order.userId);
      console.log("Found user:", user ? "Yes" : "No");
      
      if (user) {
        console.log("User email:", user.email);
        console.log("User name:", user.userName || user.firstName || 'Customer');
      }
      
      if (user && user.email) {
        console.log("Attempting to send order confirmation email to:", user.email);
        const emailResult = await sendOrderConfirmationEmail(
          user.email,
          user.userName || user.firstName || 'Customer',
          order
        );
        
        console.log("Email result:", emailResult);
        
        if (emailResult.success) {
          console.log("✅ Order confirmation email sent successfully");
        } else {
          console.error("❌ Failed to send order confirmation email:", emailResult.error);
        }
      } else {
        console.log("❌ User not found or no email address for order:", order._id);
        if (!user) {
          console.log("User not found in database");
        } else if (!user.email) {
          console.log("User found but no email address");
        }
      }
      console.log("=== EMAIL DEBUG END ===");
    } catch (emailError) {
      console.error("❌ Error sending order confirmation email:", emailError);
      console.error("Email error stack:", emailError.stack);
      // Don't fail the order if email fails
    }

    res.status(200).json({
      success: true,
      message: "Order confirmed",
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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching orders for userId:", userId);

    if (!userId) {
      console.log("No userId provided");
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({ userId });
    console.log("Found orders:", orders.length);
    console.log("Orders data:", orders);

    // Also check if there are any orders with different userId formats
    const allOrders = await Order.find({});
    console.log("Total orders in database:", allOrders.length);
    if (allOrders.length > 0) {
      console.log("Sample order userIds:", allOrders.map(o => ({ id: o._id, userId: o.userId })));
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log("Error fetching orders:", e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};