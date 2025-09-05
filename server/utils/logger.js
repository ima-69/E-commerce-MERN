const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = process.env.LOG_LEVEL || 'INFO';

// Format log message
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };
  
  return JSON.stringify(logEntry);
};

// Write to file
const writeToFile = (filename, message) => {
  const logFile = path.join(logsDir, filename);
  fs.appendFileSync(logFile, message + '\n');
};

// Logger class
class Logger {
  constructor() {
    this.logLevel = LOG_LEVELS[currentLogLevel];
  }

  shouldLog(level) {
    return LOG_LEVELS[level] <= this.logLevel;
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = formatLogMessage(level, message, meta);
    
    // Console output
    console.log(formattedMessage);
    
    // File output
    const filename = `${new Date().toISOString().split('T')[0]}.log`;
    writeToFile(filename, formattedMessage);
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // Specific logging methods for different types of events
  apiRequest(req, res, responseTime) {
    this.info('API Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  }

  apiError(error, req) {
    this.error('API Error', {
      message: error.message,
      stack: error.stack,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  databaseError(error, operation) {
    this.error('Database Error', {
      message: error.message,
      operation,
      stack: error.stack
    });
  }

  authError(error, userId, action) {
    this.warn('Authentication Error', {
      message: error.message,
      userId,
      action,
      ip: error.ip || 'unknown'
    });
  }

  businessLogicError(error, context) {
    this.warn('Business Logic Error', {
      message: error.message,
      context,
      stack: error.stack
    });
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
