const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/User");
const { sendPasswordResetEmail, sendPasswordResetConfirmation } = require("../../helpers/emailService");

//register
const registerUser = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    // Check if user exists with email
    const checkUserByEmail = await User.findOne({ email });
    if (checkUserByEmail)
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again",
      });

    // Check if user exists with username
    const checkUserByUsername = await User.findOne({ userName });
    if (checkUserByUsername)
      return res.json({
        success: false,
        message: "Username already taken! Please choose a different username",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

//login

const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Check if the input is an email or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);
    
    let checkUser;
    if (isEmail) {
      checkUser = await User.findOne({ email: emailOrUsername });
    } else {
      checkUser = await User.findOne({ userName: emailOrUsername });
    }

    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

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
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured",
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
  // Check for token in Authorization header first, then cookies
  let token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    token = req.cookies.token;
  }
  
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
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
    const user = await User.findOne({ email });
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
    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
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
    const user = await User.findOne({
      resetPasswordToken: token,
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
  registerUser, 
  loginUser, 
  logoutUser, 
  authMiddleware, 
  adminMiddleware,
  forgotPassword,
  resetPassword,
  verifyResetToken
};
