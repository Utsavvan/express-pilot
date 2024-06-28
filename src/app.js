const fs = require("fs");
const path = require("path");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const winston = require("winston");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const { expressCspHeader } = require("express-csp-header");
const {
  isDevelopment,
  cspOptions,
  corsOptions,
  sessionConfig,

  logger,
  accessLogStream,
} = require("@Config/helperVariables");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(morgan("common", { stream: accessLogStream }));
app.use(morgan("common"));
app.use(
  helmet({
    crossOriginEmbedderPolicy: !isDevelopment,
    contentSecurityPolicy: !isDevelopment,
  })
);
app.use(cors(corsOptions));
app.use(expressCspHeader(cspOptions));

app.use(session(sessionConfig));

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

/************ App routers ************/
// define api routes here

// express endpoint for front end react app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
