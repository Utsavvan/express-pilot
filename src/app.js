const fs = require("fs");
const path = require("path");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const winston = require("winston");

const app = express();

// Defined variables and configs
// Define the log file path
const logFilePath = path.join(__dirname, "logs", "access.log");

// Create a write stream (in append mode) for the log file
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Setup Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath }),
  ],
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(morgan("common", { stream: accessLogStream }));
app.use(morgan("common"));
app.use(helmet());
app.use(cors());

// A middleware to capture logs from controllers and direct them to Winston
app.use((req, res, next) => {
  const originalConsoleLog = console.log;

  // Override console.log to capture logs
  console.log = function (...args) {
    logger.info(args.join(" "));
    originalConsoleLog.apply(console, args);
  };

  next();
});

const mainRouter = express.Router();

// set main router for whole app
app.use("/api", mainRouter);

// express endpoint for front end react app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
