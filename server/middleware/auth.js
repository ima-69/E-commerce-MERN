const jwt = require("jsonwebtoken");

// Auth middleware
const authenticateToken = async (req, res, next) => {
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

module.exports = {
  authenticateToken,
  adminMiddleware
};

