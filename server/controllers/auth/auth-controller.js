const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../../models/User");
const { sendPasswordResetEmail, sendPasswordResetConfirmation } = require("../../helpers/emailService");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");
const { signToken, verifyToken } = require("../../utils/jwt");

//register
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  // Check if user exists with email
  const checkUserByEmail = await User.findOne({ email });
  if (checkUserByEmail) {
    throw createError.conflict("User already exists with the same email! Please try again");
  }

  // Check if user exists with username
  const checkUserByUsername = await User.findOne({ userName });
  if (checkUserByUsername) {
    throw createError.conflict("Username already taken! Please choose a different username");
  }

  const hashPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    firstName,
    lastName,
    userName,
    email,
    password: hashPassword,
  });

  await newUser.save();
  
  logger.info('New user registered', { 
    userId: newUser._id, 
    email: newUser.email, 
    userName: newUser.userName 
  });
  
  res.status(200).json({
    success: true,
    message: "Registration successful",
  });
});

//login
const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  // Check if the input is an email or username
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);
  
  let checkUser;
  if (isEmail) {
    checkUser = await User.findOne({ email: emailOrUsername });
  } else {
    checkUser = await User.findOne({ userName: emailOrUsername });
  }

  if (!checkUser) {
    throw createError.unauthorized("User doesn't exist! Please register first");
  }

  const checkPasswordMatch = await bcrypt.compare(
    password,
    checkUser.password
  );
  if (!checkPasswordMatch) {
    throw createError.unauthorized("Incorrect password! Please try again");
  }

  const token = signToken({
    id: checkUser._id,
    role: checkUser.role,
    email: checkUser.email,
    userName: checkUser.userName,
    firstName: checkUser.firstName,
    lastName: checkUser.lastName,
  });

  logger.info('User logged in', { 
    userId: checkUser._id, 
    email: checkUser.email, 
    role: checkUser.role 
  });

  res.cookie("token", token, { httpOnly: true, secure: false }).json({
    success: true,
    message: "Logged in successfully",
    user: {
      email: checkUser.email,
      role: checkUser.role,
      id: checkUser._id,
      userName: checkUser.userName,
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
    },
  });
});

//logout
const logoutUser = (req, res) => {
  logger.info('User logged out', { userId: req.user?.id });
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
      message: "Unauthorized user!",
    });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn("Authentication failed", { error: error.message, ip: req.ip });
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

//admin middleware
const adminMiddleware = async (req, res, next) => {
  // Check for token in Authorization header first, then cookies
  let token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    token = req.cookies.token;
  }
  
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });

  try {
    const decoded = verifyToken(token);
    if (decoded.role !== "admin") {
      logger.warn("Admin access denied", { userId: decoded.id, role: decoded.role, ip: req.ip });
      return res.status(403).json({
        success: false,
        message: "Access denied! Admin role required.",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn("Admin authentication failed", { error: error.message, ip: req.ip });
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createError.notFound("No user found with this email address");
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
    logger.info('Password reset email sent', { userId: user._id, email: user.email });
    res.json({
      success: true,
      message: "Password reset email sent successfully. Please check your email.",
    });
  } else {
    // Clear the reset token if email failed
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    logger.error('Failed to send password reset email', { 
      userId: user._id, 
      email: user.email, 
      error: emailResult.error 
    });
    
    throw createError.serverError("Failed to send reset email. Please try again later.");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    throw createError.unauthorized("Invalid or expired reset token");
  }

  // Validate new password
  if (!newPassword || newPassword.length < 8) {
    throw createError.validation("Password must be at least 8 characters long");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update user password and clear reset token
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  // Send confirmation email
  try {
    await sendPasswordResetConfirmation(user.email, user.firstName);
  } catch (emailError) {
    logger.warn('Failed to send password reset confirmation email', { 
      userId: user._id, 
      error: emailError.message 
    });
    // Don't fail the reset if email fails
  }

  logger.info('Password reset successfully', { userId: user._id, email: user.email });

  res.json({
    success: true,
    message: "Password reset successfully. You can now login with your new password.",
  });
});

// Verify Reset Token
const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    throw createError.unauthorized("Invalid or expired reset token");
  }

  logger.info('Reset token verified', { userId: user._id, email: user.email });

  res.json({
    success: true,
    message: "Reset token is valid",
    user: {
      email: user.email,
      firstName: user.firstName,
    },
  });
});

module.exports = { 
  registerUser, 
  loginUser, 
  logoutUser, 
  authMiddleware, 
  adminMiddleware,
  forgotPassword,
  resetPassword,
  verifyResetToken
};
