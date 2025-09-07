const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
} = require("../../controllers/admin/order-controller");

const { adminMiddleware } = require("../../controllers/auth/auth-controller");
const { validationRules } = require("../../middleware/validation");

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", validationRules.getById, getOrderDetailsForAdmin);
router.put("/update/:id", validationRules.getById, updateOrderStatus);
router.delete("/delete/:id", validationRules.getById, deleteOrder);

module.exports = router;