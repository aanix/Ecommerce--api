const winston = require("winston");

// Create logger
const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),

  transports: [
    // Console logs
    new winston.transports.Console(),

    // All logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),

    // Error logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

module.exports = logger;

