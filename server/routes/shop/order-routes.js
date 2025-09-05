const express = require("express");
const { authenticateToken } = require("../../middleware/auth");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", authenticateToken, createOrder);
router.post("/capture", authenticateToken, capturePayment);
router.get("/list/:userId", authenticateToken, getAllOrdersByUser);
router.get("/details/:id", authenticateToken, getOrderDetails);

module.exports = router;