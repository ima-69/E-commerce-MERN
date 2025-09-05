# Error Handling Quick Reference

## Quick Setup

### 1. Controller Error Handling
```javascript
const { asyncHandler, createError } = require('../../utils/errorHandler');
const logger = require('../../utils/logger');

const myController = asyncHandler(async (req, res) => {
  // Your logic here
  if (!data) {
    throw createError.notFound("Data not found");
  }
  
  logger.info('Operation successful', { userId: req.user?.id });
  res.json({ success: true, data });
});
```

### 2. Route Validation
```javascript
const { authValidation, handleValidationErrors } = require('../../utils/validators');

router.post('/endpoint', 
  authValidation.register, 
  handleValidationErrors, 
  controller
);
```

### 3. Frontend Error Handling
```javascript
// Wrap your app
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Handle errors in components
try {
  const result = await apiCall();
} catch (error) {
  setError(error.message);
}
```

## Error Types

| Function | Status | Use Case |
|----------|--------|----------|
| `createError.badRequest()` | 400 | Invalid input data |
| `createError.unauthorized()` | 401 | Authentication required |
| `createError.forbidden()` | 403 | Access denied |
| `createError.notFound()` | 404 | Resource not found |
| `createError.conflict()` | 409 | Duplicate resource |
| `createError.validation()` | 422 | Validation failed |
| `createError.serverError()` | 500 | Internal server error |

## Logging Examples

```javascript
const { logger, securityLogger, databaseLogger } = require('./utils/winstonLogger');

// General logging
logger.info('User action', { userId, action: 'login' });
logger.error('Database error', { error: err.message });

// Security events
securityLogger.warn('Failed login', { ip: req.ip, email });

// Database operations
databaseLogger.info('Query executed', { query, duration: '50ms' });
```

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 15 minutes |
| Auth endpoints | 5 requests | 15 minutes |
| Password reset | 3 requests | 1 hour |
| Product operations | 50 requests | 15 minutes |
| Admin operations | 200 requests | 15 minutes |

## Health Check Endpoints

```bash
# Health status
GET /api/health

# Error statistics
GET /api/error-stats
```

## Common Patterns

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed: Email is required, Password must be at least 8 characters",
  "errors": [
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404
}
```

## Environment Variables

```env
# Required
NODE_ENV=production
LOG_LEVEL=info

# Optional
ADMIN_ALLOWED_IPS=192.168.1.100,10.0.0.50
API_KEYS=key1,key2,key3
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing Error Handling

```bash
# Test rate limiting
for i in {1..10}; do curl http://localhost:5000/api/auth/login; done

# Test validation
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'

# Test health check
curl http://localhost:5000/api/health
```
