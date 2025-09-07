const express = require("express");
const {
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Forgot Password Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;