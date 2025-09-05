const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");
const { productValidation, handleValidationErrors } = require("../../utils/validators");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", productValidation.getById, handleValidationErrors, getProductDetails);

module.exports = router;