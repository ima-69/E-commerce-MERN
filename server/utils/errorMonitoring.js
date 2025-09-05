const logger = require('./logger');

class ErrorMonitoringService {
  constructor() {
    this.errorCounts = new Map();
    this.errorThresholds = {
      '5xx': 10, // 10 server errors per minute
      '4xx': 50, // 50 client errors per minute
      'database': 5, // 5 database errors per minute
      'auth': 20, // 20 auth errors per minute
    };
    this.alertCooldown = 5 * 60 * 1000; // 5 minutes
    this.lastAlerts = new Map();
  }

  // Track error occurrence
  trackError(error, context = {}) {
    const errorType = this.categorizeError(error);
    const timestamp = Date.now();
    
    // Increment error count
    if (!this.errorCounts.has(errorType)) {
      this.errorCounts.set(errorType, []);
    }
    
    const errors = this.errorCounts.get(errorType);
    errors.push(timestamp);
    
    // Keep only last minute of errors
    const oneMinuteAgo = timestamp - 60000;
    const recentErrors = errors.filter(time => time > oneMinuteAgo);
    this.errorCounts.set(errorType, recentErrors);
    
    // Log error with context
    this.logError(error, context, errorType);
    
    // Check if threshold exceeded
    this.checkThresholds(errorType, recentErrors.length);
  }

  // Categorize error type
  categorizeError(error) {
    if (error.statusCode >= 500) return '5xx';
    if (error.statusCode >= 400) return '4xx';
    if (error.message && error.message.includes('database')) return 'database';
    if (error.message && error.message.includes('auth')) return 'auth';
    if (error.name === 'ValidationError') return 'validation';
    if (error.name === 'CastError') return 'cast';
    if (error.code === 11000) return 'duplicate';
    return 'other';
  }

  // Log error with structured data
  logError(error, context, errorType) {
    const errorData = {
      type: errorType,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        userAgent: context.userAgent,
        ip: context.ip,
        url: context.url,
        method: context.method,
      }
    };

    // Log based on severity
    if (error.statusCode >= 500) {
      logger.error('Server Error', errorData);
    } else if (error.statusCode >= 400) {
      logger.warn('Client Error', errorData);
    } else {
      logger.info('Application Error', errorData);
    }
  }

  // Check if error thresholds are exceeded
  checkThresholds(errorType, count) {
    const threshold = this.errorThresholds[errorType];
    if (!threshold) return;

    if (count >= threshold) {
      const now = Date.now();
      const lastAlert = this.lastAlerts.get(errorType) || 0;
      
      // Check cooldown period
      if (now - lastAlert > this.alertCooldown) {
        this.sendAlert(errorType, count, threshold);
        this.lastAlerts.set(errorType, now);
      }
    }
  }

  // Send alert (in production, this would integrate with monitoring services)
  sendAlert(errorType, count, threshold) {
    const alert = {
      type: 'ERROR_THRESHOLD_EXCEEDED',
      errorType,
      count,
      threshold,
      timestamp: new Date().toISOString(),
      message: `Error threshold exceeded: ${errorType} errors (${count}/${threshold})`
    };

    logger.error('ALERT', alert);
    
    // In production, you would send this to:
    // - Slack/Discord webhooks
    // - Email notifications
    // - PagerDuty
    // - DataDog, New Relic, etc.
    console.error('🚨 ALERT:', alert.message);
  }

  // Get error statistics
  getErrorStats() {
    const stats = {};
    for (const [errorType, errors] of this.errorCounts.entries()) {
      stats[errorType] = {
        count: errors.length,
        lastError: errors.length > 0 ? new Date(Math.max(...errors)).toISOString() : null
      };
    }
    return stats;
  }

  // Reset error counts (useful for testing)
  resetCounts() {
    this.errorCounts.clear();
    this.lastAlerts.clear();
  }

  // Health check based on error rates
  getHealthStatus() {
    const stats = this.getErrorStats();
    const criticalErrors = ['5xx', 'database'];
    const warningErrors = ['4xx', 'auth'];
    
    for (const errorType of criticalErrors) {
      if (stats[errorType] && stats[errorType].count >= this.errorThresholds[errorType]) {
        return { status: 'critical', errors: stats };
      }
    }
    
    for (const errorType of warningErrors) {
      if (stats[errorType] && stats[errorType].count >= this.errorThresholds[errorType]) {
        return { status: 'warning', errors: stats };
      }
    }
    
    return { status: 'healthy', errors: stats };
  }
}

// Create singleton instance
const errorMonitoring = new ErrorMonitoringService();

// Middleware to track errors
const errorTrackingMiddleware = (error, req, res, next) => {
  const context = {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    body: req.body,
    query: req.query,
    params: req.params
  };
  
  errorMonitoring.trackError(error, context);
  next(error);
};

// API endpoint to get error statistics
const getErrorStats = (req, res) => {
  const stats = errorMonitoring.getErrorStats();
  const health = errorMonitoring.getHealthStatus();
  
  res.json({
    success: true,
    data: {
      stats,
      health,
      timestamp: new Date().toISOString()
    }
  });
};

// API endpoint for health check
const healthCheck = (req, res) => {
  const health = errorMonitoring.getHealthStatus();
  const statusCode = health.status === 'critical' ? 503 : 
                    health.status === 'warning' ? 200 : 200;
  
  res.status(statusCode).json({
    success: health.status !== 'critical',
    status: health.status,
    timestamp: new Date().toISOString(),
    errors: health.errors
  });
};

module.exports = {
  errorMonitoring,
  errorTrackingMiddleware,
  getErrorStats,
  healthCheck
};
