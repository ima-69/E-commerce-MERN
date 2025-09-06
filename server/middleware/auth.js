const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });

  try {
    const decoded = verifyToken(token);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated!",
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

// Admin middleware
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
      message: "Unauthorized user!",
    });
  }
};

// Browsing middleware - allows deactivated users to browse but not perform actions
const browsingMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }
    
    // Allow both active and inactive users to browse
    req.user = decoded;
    req.user.isActive = user.isActive; // Add isActive to req.user
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = {
  authenticateToken,
  adminMiddleware,
  browsingMiddleware
};

