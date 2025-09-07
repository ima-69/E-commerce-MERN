const express = require("express");
const { authenticateToken } = require("../../middleware/auth");

const {
  addAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const router = express.Router();

router.post("/add", authenticateToken, addAddress);
router.get("/get/:userId", authenticateToken, fetchAllAddress);
router.delete("/delete/:userId/:addressId", authenticateToken, deleteAddress);
router.put("/update/:userId/:addressId", authenticateToken, editAddress);

module.exports = router;