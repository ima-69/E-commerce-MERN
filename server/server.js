const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csrf');

dotenv.config();

const authRouter = require("./routes/auth/auth-routes");
const profileRouter = require("./routes/auth/profile-routes");

const adminProductRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminUserRouter = require("./routes/admin/user-routes");

const shopProductRouter = require("./routes/shop/products-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const { testEmail } = require("./helpers/emailService");

const auth0 = require("./routes/auth0/auth0")

mongoose
    .connect(process.env.mongodbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 1000 requests per windowMs (more generous for development)
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for development (localhost)
        return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
    }
});

// Apply rate limiting to all requests
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs for auth (more reasonable for development)
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for development (localhost)
        return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
    }
});

// Custom NoSQL injection sanitization middleware
const sanitizeInput = (req, res, next) => {
    const sanitizeObject = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            // Replace MongoDB operators with safe alternatives
            const sanitizedKey = key.replace(/^\$/, '_');
            sanitized[sanitizedKey] = sanitizeObject(value);
        }
        return sanitized;
    };
    
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    
    next();
};

app.use(sanitizeInput);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
    cors({
        origin: process.env.VITE_FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders : [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma',
            'X-CSRF-Token'
        ],
        credentials: true
    })
);

app.use(cookieParser());

// CSRF Protection Configuration
const csrfProtection = csrf();

// Apply CSRF protection to all routes except GET requests and auth endpoints
app.use((req, res, next) => {
    // Skip CSRF for GET requests, auth endpoints, and static files
    if (req.method === 'GET' || 
        req.path.startsWith('/api/auth0') || 
        req.path.startsWith('/api/auth/login') ||
        req.path.startsWith('/api/auth/forgot-password') ||
        req.path.startsWith('/api/auth/reset-password') ||
        req.path.includes('/csrf-token')) {
        return next();
    }
    
    // Skip CSRF for image upload routes (handled by multer)
    if (req.path.includes('/upload-image')) {
        return next();
    }
    
    // Apply CSRF protection to all other routes
    const secret = (req.cookies && req.cookies._csrf) || csrfProtection.secretSync();
    const token = req.headers['x-csrf-token'] || (req.body && req.body._csrf);
    
    if (!token || !csrfProtection.verify(secret, token)) {
        return res.status(403).json({
            success: false,
            message: 'Invalid CSRF token'
        });
    }
    
    next();
});

// CSRF Token endpoint for frontend
app.get('/api/csrf-token', (req, res) => {
    const secret = (req.cookies && req.cookies._csrf) || csrfProtection.secretSync();
    const token = csrfProtection.create(secret);
    
    // Set CSRF secret in cookie if not already set
    if (!req.cookies || !req.cookies._csrf) {
        res.cookie('_csrf', secret, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        });
    }
    
    res.json({ 
        csrfToken: token 
    });
});

// Apply auth rate limiting to authentication routes
app.use("/api/auth0", authLimiter, auth0);
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/profile", profileRouter);

app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/users", adminUserRouter);

app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/wishlist", shopWishlistRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Email test endpoint
app.get("/api/test-email", async (req, res) => {
  const result = await testEmail();
  res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});