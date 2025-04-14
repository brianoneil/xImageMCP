const fs = require('fs/promises');
const path = require('path');

/**
 * Log levels for the application
 * @enum {string}
 */
const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

/**
 * Service class for handling application logging
 */
class Logger {
  /**
   * @param {string} logPath - Path to the log file
   * @param {LogLevel} minLevel - Minimum log level to record
   */
  constructor(logPath, minLevel = LogLevel.INFO) {
    this.logPath = logPath;
    this.minLevel = minLevel;
    this.logQueue = [];
    this.isProcessing = false;
  }

  /**
   * Log a message with the specified level
   * @param {LogLevel} level - Log level
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata to log
   * @returns {Promise<void>}
   */
  async log(level, message, metadata = {}) {
    if (!this.shouldLog(level)) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata
    };

    this.logQueue.push(logEntry);
    await this.processLogQueue();
  }

  /**
   * Check if a log level should be recorded
   * @param {LogLevel} level - Log level to check
   * @returns {boolean}
   * @private
   */
  shouldLog(level) {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  /**
   * Process the log queue and write to file
   * @returns {Promise<void>}
   * @private
   */
  async processLogQueue() {
    if (this.isProcessing || this.logQueue.length === 0) return;

    this.isProcessing = true;
    try {
      const logDir = path.dirname(this.logPath);
      await fs.mkdir(logDir, { recursive: true });

      while (this.logQueue.length > 0) {
        const entry = this.logQueue.shift();
        const logLine = JSON.stringify(entry) + '\n';
        await fs.appendFile(this.logPath, logLine, 'utf8');
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
      // Put the entries back in the queue
      this.logQueue.unshift(...this.logQueue);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Log a debug message
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata
   */
  debug(message, metadata) {
    return this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Log an info message
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata
   */
  info(message, metadata) {
    return this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Log a warning message
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata
   */
  warn(message, metadata) {
    return this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Log an error message
   * @param {string} message - Message to log
   * @param {Object} [metadata] - Additional metadata
   */
  error(message, metadata) {
    return this.log(LogLevel.ERROR, message, metadata);
  }
}

module.exports = {
  Logger,
  LogLevel
}; 