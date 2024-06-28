const fs = require("fs");
const path = require("path");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const winston = require("winston");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const { expressCspHeader, SELF } = require("express-csp-header");

const { MONGO_URL } = require("@Services/mongo");

const app = express();

/******** Defined variables and configs ********/
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

let sessionConfig = {
  name: "SESS_NAME",
  secret: process?.env?.COOKIE_KEY || "secret",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: false,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
  store: MONGO_URL
    ? MongoStore.create({
        mongoUrl: MONGO_URL,
      })
    : "",
};

let corsOptions = {
  credentials: true,
  methods: [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
    "TRACE",
    "OPTIONS",
    "PATCH",
  ],
  origin: ["http://localhost:3001", "http://localhost:1234"],
};

let cspOptions = {
  policies: {
    "default-src": [
      SELF,
      // Add a allowed domains
    ],
    "connect-src": [SELF],
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(morgan("common", { stream: accessLogStream }));
app.use(morgan("common"));
app.use(helmet());
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
