const express = require("express");
const {
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require("../../controllers/auth/auth-controller");
const { validationRules } = require("../../middleware/validation");

const router = express.Router();

router.post("/login", validationRules.login, loginUser);
router.post("/logout", logoutUser);

// Forgot Password Routes
router.post("/forgot-password", validationRules.forgotPassword, forgotPassword);
router.post("/reset-password", validationRules.resetPassword, resetPassword);
router.get("/verify-reset-token/:token", validationRules.getById, verifyResetToken);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;