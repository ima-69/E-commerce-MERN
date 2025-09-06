const jwt = require('jsonwebtoken');

// Get JWT secret from environment variables
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.CLIENT_SECRET_KEY;
  
  if (!secret) {
    throw new Error('JWT secret not configured. Please set JWT_SECRET or CLIENT_SECRET_KEY environment variable.');
  }
  
  return secret;
};

// Sign JWT token
const signToken = (payload, expiresIn = '60m') => {
  try {
    const secret = getJWTSecret();
    return jwt.sign(payload, secret, { expiresIn });
  } catch (error) {
    throw new Error(`Failed to sign JWT token: ${error.message}`);
  }
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    const secret = getJWTSecret();
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
};

// Decode JWT token without verification (for debugging)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error(`Failed to decode token: ${error.message}`);
  }
};

module.exports = {
  signToken,
  verifyToken,
  decodeToken,
  getJWTSecret
};
