const express = require("express");
const multer = require("multer");
const { authenticateToken } = require("../../middleware/auth");
const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  changePassword
} = require("../../controllers/auth/profile-controller");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get user profile
router.get("/", authenticateToken, getUserProfile);

// Update user profile
router.put("/", authenticateToken, updateUserProfile);

// Upload profile picture
router.post("/picture", authenticateToken, upload.single('profilePicture'), uploadProfilePicture);

// Delete profile picture
router.delete("/picture", authenticateToken, deleteProfilePicture);

// Change password
router.put("/password", authenticateToken, changePassword);

module.exports = router;
