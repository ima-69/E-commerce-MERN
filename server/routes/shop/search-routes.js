const express = require("express");

const { searchProducts } = require("../../controllers/shop/search-controller");
const { validationRules } = require("../../middleware/validation");

const router = express.Router();

router.get("/:keyword", validationRules.searchProducts, searchProducts);

module.exports = router;