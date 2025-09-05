const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
} = require("../../controllers/admin/order-controller");

const { adminMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.delete("/delete/:id", deleteOrder);

module.exports = router;