# Error Handling & Security Guide

This document provides a comprehensive guide to the error handling and security systems implemented in this MERN e-commerce application.

## Table of Contents

1. [Overview](#overview)
2. [Error Handling System](#error-handling-system)
3. [Input Validation](#input-validation)
4. [Logging System](#logging-system)
5. [Security Features](#security-features)
6. [Monitoring & Alerting](#monitoring--alerting)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

The application implements a comprehensive error handling and security system with the following components:

- **Global Error Boundary** (React)
- **Centralized Error Handling** (Express)
- **Input Validation** (express-validator)
- **Structured Logging** (Winston)
- **Rate Limiting** (express-rate-limit)
- **Security Headers** (helmet)
- **Error Monitoring** (Custom service)

## Error Handling System

### Frontend (React)

#### Error Boundary
Located at `client/src/components/common/error-boundary.jsx`

```jsx
import ErrorBoundary from './components/common/error-boundary';

// Wrap your app
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Features:**
- Catches JavaScript errors anywhere in the component tree
- Displays user-friendly error UI
- Provides retry functionality
- Shows detailed error info in development mode
- Logs errors for monitoring

### Backend (Express)

#### Error Handler Utilities
Located at `server/utils/errorHandler.js`

**Key Components:**
- `AppError` class for custom errors
- `createError` helper for common error types
- `asyncHandler` wrapper for async functions
- `globalErrorHandler` middleware
- `notFoundHandler` for 404 errors

**Usage Example:**
```javascript
const { asyncHandler, createError } = require('./utils/errorHandler');

const myController = asyncHandler(async (req, res) => {
  if (!data) {
    throw createError.notFound("Data not found");
  }
  
  res.json({ success: true, data });
});
```

**Available Error Types:**
- `createError.badRequest()` - 400
- `createError.unauthorized()` - 401
- `createError.forbidden()` - 403
- `createError.notFound()` - 404
- `createError.conflict()` - 409
- `createError.validation()` - 422
- `createError.serverError()` - 500

## Input Validation

### Validation System
Located at `server/utils/validators.js`

**Features:**
- Comprehensive validation rules for all endpoints
- Custom validation middleware
- Detailed error messages
- Sanitization and normalization

**Usage Example:**
```javascript
const { authValidation, handleValidationErrors } = require('./utils/validators');

router.post('/register', 
  authValidation.register, 
  handleValidationErrors, 
  registerUser
);
```

**Validation Rules Include:**
- User registration/login
- Product creation/updates
- Cart operations
- Order processing
- Profile updates
- Search queries

## Logging System

### Winston Logger
Located at `server/utils/winstonLogger.js`

**Log Levels:**
- `error` - System errors
- `warn` - Warnings
- `info` - General information
- `http` - HTTP requests
- `debug` - Debug information

**Log Files:**
- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs
- `http-YYYY-MM-DD.log` - HTTP requests
- `performance-YYYY-MM-DD.log` - Performance metrics
- `security-YYYY-MM-DD.log` - Security events
- `database-YYYY-MM-DD.log` - Database operations
- `business-YYYY-MM-DD.log` - Business logic events

**Features:**
- Daily log rotation
- File size limits
- Compression
- Different log levels for different environments
- Structured JSON logging

### Usage Examples

```javascript
const { logger, securityLogger, databaseLogger } = require('./utils/winstonLogger');

// General logging
logger.info('User logged in', { userId: user.id });

// Security events
securityLogger.warn('Failed login attempt', { ip: req.ip });

// Database operations
databaseLogger.info('Query executed', { query: 'findUser', duration: '50ms' });
```

## Security Features

### Rate Limiting
Located at `server/middleware/security.js`

**Rate Limits:**
- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Password reset**: 3 requests per hour
- **Product operations**: 50 requests per 15 minutes
- **Admin operations**: 200 requests per 15 minutes

**Speed Limiting:**
- 50 requests per 15 minutes, then 500ms delay per request
- Maximum delay of 20 seconds

### Security Headers
Using Helmet.js for security headers:

- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### Additional Security Features

- **Request size limiting**: 10MB maximum
- **Suspicious activity detection**: XSS, SQL injection, directory traversal
- **IP whitelisting** for admin endpoints
- **API key validation** (optional)
- **Security event logging**

## Monitoring & Alerting

### Error Monitoring Service
Located at `server/utils/errorMonitoring.js`

**Features:**
- Error categorization and tracking
- Threshold-based alerting
- Health status monitoring
- Error statistics API

**Endpoints:**
- `GET /api/health` - Health check
- `GET /api/error-stats` - Error statistics

**Error Categories:**
- 5xx errors (server errors)
- 4xx errors (client errors)
- Database errors
- Authentication errors
- Validation errors

**Alert Thresholds:**
- 5xx errors: 10 per minute
- 4xx errors: 50 per minute
- Database errors: 5 per minute
- Auth errors: 20 per minute

## Best Practices

### For Developers

1. **Always use asyncHandler** for async controller functions
2. **Use specific error types** instead of generic errors
3. **Log meaningful context** with errors
4. **Validate input** at the route level
5. **Handle errors gracefully** in the frontend

### Error Handling Pattern

```javascript
// Controller
const myController = asyncHandler(async (req, res) => {
  // Validate input
  if (!req.body.email) {
    throw createError.badRequest("Email is required");
  }

  // Business logic
  const user = await User.findByEmail(req.body.email);
  if (!user) {
    throw createError.notFound("User not found");
  }

  // Log success
  logger.info('User found', { userId: user.id });

  res.json({ success: true, data: user });
});
```

### Frontend Error Handling

```javascript
// Component with error handling
const MyComponent = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      // Handle success
    } catch (err) {
      setError(err.message || 'Something went wrong');
      logger.error('Component error', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={handleAction} />;
  }

  return <div>Content</div>;
};
```

## Troubleshooting

### Common Issues

1. **Rate limit exceeded**
   - Check if you're making too many requests
   - Wait for the rate limit window to reset
   - Check rate limit configuration

2. **Validation errors**
   - Check request body format
   - Verify required fields are provided
   - Check data types and formats

3. **Log files not created**
   - Ensure logs directory exists
   - Check file permissions
   - Verify Winston configuration

4. **Security headers not applied**
   - Check Helmet configuration
   - Verify middleware order
   - Test with security headers scanner

### Debug Mode

Enable debug logging:
```bash
LOG_LEVEL=debug npm start
```

### Health Check

Check application health:
```bash
curl http://localhost:5000/api/health
```

### Error Statistics

View error statistics:
```bash
curl http://localhost:5000/api/error-stats
```

## Environment Variables

Add these to your `.env` file:

```env
# Logging
LOG_LEVEL=info
NODE_ENV=production

# Security
ADMIN_ALLOWED_IPS=192.168.1.100,10.0.0.50
API_KEYS=key1,key2,key3

# Rate Limiting (optional overrides)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Monitoring Integration

For production environments, consider integrating with:

- **Sentry** for error tracking
- **DataDog** for monitoring
- **New Relic** for performance monitoring
- **PagerDuty** for alerting
- **Slack/Discord** for notifications

## Conclusion

This error handling and security system provides:

- ✅ Comprehensive error catching and handling
- ✅ Input validation and sanitization
- ✅ Structured logging and monitoring
- ✅ Rate limiting and security headers
- ✅ Health monitoring and alerting
- ✅ Developer-friendly error messages
- ✅ Production-ready security features

The system is designed to be robust, scalable, and maintainable while providing excellent developer experience and user safety.
