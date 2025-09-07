const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/User");
const { sendPasswordResetEmail, sendPasswordResetConfirmation } = require("../../helpers/emailService");
const { validationResult } = require('express-validator');

//login
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Additional input sanitization
    const sanitizedEmailOrUsername = emailOrUsername?.toString().trim().toLowerCase();
    
    if (!sanitizedEmailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required",
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: sanitizedEmailOrUsername }, { userName: sanitizedEmailOrUsername }],
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.json({
        success: false,
        message: "Account is deactivated!",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//logout
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

//admin middleware
const adminMiddleware = async (req, res, next) => {
  try {
    // Check for token in Authorization header first, then cookies
    let token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised user!",
      });
    }

    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied! Admin role required.",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Sanitize email input
    const sanitizedEmail = email?.toString().trim().toLowerCase();
    
    if (!sanitizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.json({
        success: false,
        message: "No user found with this email address",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.firstName);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: "Password reset email sent successfully. Please check your email.",
      });
    } else {
      // Clear the reset token if email failed
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      res.json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Sanitize inputs
    const sanitizedToken = token?.toString().trim();
    
    if (!sanitizedToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Validate token format
    if (sanitizedToken.length < 32 || sanitizedToken.length > 64) {
      return res.status(400).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: sanitizedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Enhanced password validation
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send confirmation email
    await sendPasswordResetConfirmation(user.email, user.firstName);

    res.json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting your password",
    });
  }
};

// Verify Reset Token
const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    // Sanitize token input
    const sanitizedToken = token?.toString().trim();
    
    if (!sanitizedToken) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // Validate token format
    if (sanitizedToken.length < 32 || sanitizedToken.length > 64) {
      return res.status(400).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: sanitizedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    res.json({
      success: true,
      message: "Reset token is valid",
      user: {
        email: user.email,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred while verifying the reset token",
    });
  }
};

module.exports = { 
  loginUser,
  logoutUser, 
  authMiddleware, 
  adminMiddleware,
  forgotPassword,
  resetPassword,
  verifyResetToken
};
