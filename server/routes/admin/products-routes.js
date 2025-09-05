const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/product-controller");
const { getDashboardOverview } = require("../../controllers/admin/dashboard-controller");

const { upload } = require("../../helpers/cloudinary");
const { adminMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

router.get("/dashboard-overview", getDashboardOverview);
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;