const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const { securityLogger } = require('../utils/winstonLogger');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      securityLogger.warn('Rate limit exceeded', {
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      
      res.status(429).json({
        success: false,
        message: message || 'Too many requests, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// General API rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP, please try again later.'
);

// Strict rate limiting for auth endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  'Too many authentication attempts, please try again later.',
  true // Skip successful requests
);

// Password reset rate limiting
const passwordResetLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // 3 requests per hour
  'Too many password reset attempts, please try again later.'
);

// Product operations rate limiting
const productLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 requests per window
  'Too many product requests, please try again later.'
);

// Admin operations rate limiting
const adminLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  200, // 200 requests per window
  'Too many admin requests, please try again later.'
);

// Slow down configuration
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes, then...
  delayMs: 500, // Add 500ms delay per request above delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  onLimitReached: (req) => {
    securityLogger.warn('Speed limit reached', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }
});

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Request size limiting
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    securityLogger.warn('Request size exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      contentLength,
      maxSize,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    return res.status(413).json({
      success: false,
      message: 'Request entity too large'
    });
  }
  
  next();
};

// IP whitelist for admin endpoints
const adminIPWhitelist = (req, res, next) => {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS ? 
    process.env.ADMIN_ALLOWED_IPS.split(',') : [];
  
  // Skip IP check in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
    securityLogger.warn('Unauthorized admin access attempt', {
      ip: clientIP,
      url: req.originalUrl,
      method: req.method,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  next();
};

// Suspicious activity detection
const suspiciousActivityDetector = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /javascript:/i, // JavaScript injection
  ];
  
  const checkString = `${req.originalUrl} ${JSON.stringify(req.body)} ${JSON.stringify(req.query)}`;
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      securityLogger.error('Suspicious activity detected', {
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        query: req.query,
        userAgent: req.get('User-Agent'),
        pattern: pattern.toString(),
        timestamp: new Date().toISOString()
      });
      
      return res.status(400).json({
        success: false,
        message: 'Invalid request'
      });
    }
  }
  
  next();
};

// API key validation (if using API keys)
const apiKeyValidator = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKeys = process.env.API_KEYS ? 
    process.env.API_KEYS.split(',') : [];
  
  // Skip API key check if no keys configured
  if (validApiKeys.length === 0) {
    return next();
  }
  
  // Skip API key check for public endpoints
  const publicEndpoints = ['/api/auth/login', '/api/auth/register', '/api/shop/products/get'];
  if (publicEndpoints.some(endpoint => req.originalUrl.startsWith(endpoint))) {
    return next();
  }
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    securityLogger.warn('Invalid API key', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method,
      apiKey: apiKey ? 'provided' : 'missing',
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};

// Request logging for security analysis
const securityRequestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log suspicious responses
    if (res.statusCode >= 400) {
      securityLogger.warn('Security event', {
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        referer: req.get('referer'),
        timestamp: new Date().toISOString()
      });
    }
  });
  
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  productLimiter,
  adminLimiter,
  speedLimiter,
  securityHeaders,
  requestSizeLimiter,
  adminIPWhitelist,
  suspiciousActivityDetector,
  apiKeyValidator,
  securityRequestLogger
};
