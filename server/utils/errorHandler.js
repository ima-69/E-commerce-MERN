// Error handling utilities for consistent error responses

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
const createError = {
  badRequest: (message = 'Bad Request') => new AppError(message, 400),
  unauthorized: (message = 'Unauthorized') => new AppError(message, 401),
  forbidden: (message = 'Forbidden') => new AppError(message, 403),
  notFound: (message = 'Not Found') => new AppError(message, 404),
  conflict: (message = 'Conflict') => new AppError(message, 409),
  validation: (message = 'Validation Error') => new AppError(message, 422),
  serverError: (message = 'Internal Server Error') => new AppError(message, 500),
  serviceUnavailable: (message = 'Service Unavailable') => new AppError(message, 503)
};

// Error response formatter
const formatErrorResponse = (error, req) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const baseResponse = {
    success: false,
    message: error.message || 'An error occurred',
    ...(isDevelopment && { 
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    })
  };

  // Add specific error details for different error types
  if (error.name === 'ValidationError') {
    baseResponse.message = 'Validation Error';
    baseResponse.errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
  }

  if (error.name === 'CastError') {
    baseResponse.message = 'Invalid ID format';
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    baseResponse.message = `${field} already exists`;
  }

  return baseResponse;
};

// Global error handler middleware
const globalErrorHandler = (error, req, res, next) => {
  let err = { ...error };
  err.message = error.message;

  // Log error
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    err = createError.notFound('Resource not found');
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    err = createError.conflict(`${field} already exists`);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(val => val.message).join(', ');
    err = createError.validation(message);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    err = createError.unauthorized('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    err = createError.unauthorized('Token expired');
  }

  // Default to 500 server error
  if (!err.statusCode) {
    err = createError.serverError();
  }

  const response = formatErrorResponse(err, req);
  
  res.status(err.statusCode).json(response);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = createError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  AppError,
  createError,
  globalErrorHandler,
  asyncHandler,
  notFoundHandler,
  formatErrorResponse
};
