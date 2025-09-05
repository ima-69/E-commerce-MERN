const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

// Get dashboard overview data
const getDashboardOverview = async (req, res) => {
  try {
    // Get total counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Get revenue data
    const revenueData = await Order.aggregate([
      {
        $match: {
          orderStatus: { $in: ["confirmed", "inProcess", "inShipping", "delivered"] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Get recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await Order.countDocuments({
      orderDate: { $gte: sevenDaysAgo }
    });

    // Get order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent orders with details
    const recentOrdersList = await Order.find()
      .sort({ orderDate: -1 })
      .limit(5)
      .populate('userId', 'firstName lastName email')
      .select('_id totalAmount orderStatus orderDate');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalProducts,
          totalUsers,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          recentOrders
        },
        orderStatusDistribution,
        recentOrdersList
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data"
    });
  }
};

module.exports = {
  getDashboardOverview
};
