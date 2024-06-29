const { logger } = require("@Config/helperVariables");

function loggerMiddleware(req, res, next) {
  const originalConsoleLog = console.log;

  // Override console.log to capture logs
  console.log = function (...args) {
    logger.info(args.join(" "));
    originalConsoleLog.apply(console, args);
  };

  next();
}

module.exports = loggerMiddleware;
