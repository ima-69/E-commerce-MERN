const express = require("express");
const { authenticateToken, adminMiddleware } = require("../../middleware/auth");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", authenticateToken, adminMiddleware, addFeatureImage);
router.get("/get", getFeatureImages);
router.delete("/delete/:id", authenticateToken, adminMiddleware, deleteFeatureImage);

module.exports = router;