const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { globalErrorHandler, notFoundHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');
const { httpLoggingMiddleware } = require('./utils/winstonLogger');
const { errorTrackingMiddleware, getErrorStats, healthCheck } = require('./utils/errorMonitoring');
const {
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
  securityRequestLogger
} = require('./middleware/security');

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

mongoose
    .connect(process.env.mongodbURI)
    .then(() => logger.info('MongoDB connected successfully'))
    .catch(err => {
      logger.error('MongoDB connection failed', { error: err.message });
      process.exit(1);
    });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.VITE_FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders : [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Security middleware
app.use(securityHeaders);
app.use(requestSizeLimiter);
app.use(suspiciousActivityDetector);
app.use(securityRequestLogger);

// Rate limiting
app.use(generalLimiter);
app.use(speedLimiter);

// HTTP request logging
app.use(httpLoggingMiddleware);

// Apply specific rate limiters to routes
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/profile", authLimiter, profileRouter);

// Special rate limiting for password reset
app.use("/api/auth/forgot-password", passwordResetLimiter);
app.use("/api/auth/reset-password", passwordResetLimiter);

app.use("/api/admin/products", adminIPWhitelist, adminLimiter, adminProductRouter);
app.use("/api/admin/orders", adminIPWhitelist, adminLimiter, adminOrderRouter);
app.use("/api/admin/users", adminIPWhitelist, adminLimiter, adminUserRouter);

app.use("/api/shop/products", productLimiter, shopProductRouter);
app.use("/api/shop/review", productLimiter, shopReviewRouter);
app.use("/api/shop/cart", productLimiter, shopCartRouter);
app.use("/api/shop/address", productLimiter, shopAddressRouter);
app.use("/api/shop/order", productLimiter, shopOrderRouter);
app.use("/api/shop/search", productLimiter, shopSearchRouter);
app.use("/api/shop/wishlist", productLimiter, shopWishlistRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Email test endpoint
app.get("/api/test-email", async (req, res) => {
  const result = await testEmail();
  res.json(result);
});

// Health check and monitoring endpoints
app.get("/api/health", healthCheck);
app.get("/api/error-stats", getErrorStats);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error tracking middleware (before global error handler)
app.use(errorTrackingMiddleware);

// Global error handler (must be last)
app.use(globalErrorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});