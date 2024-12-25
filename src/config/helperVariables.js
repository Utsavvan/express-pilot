const MongoStore = require("connect-mongo");

const path = require("path");
const fs = require("fs");
const winston = require("winston");

const { MONGO_URL } = require("@Services/mongo");
const { SELF } = require("express-csp-header");

const CLIENT_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? process.env.CLIENT_LOCAL
    : process.env.CLIENT_LIVE;

const SERVER_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? process.env.SERVER_LOCAL
    : process.env.CLIENT_LIVE;

const isDevelopment = process.env.NODE_ENV === "development";

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
  origin: [
    "http://localhost:3000",
    "http://localhost:1234",
    `${isDevelopment ? "https://studio.apollographql.com" : ""}`,
  ],
};

const config = {
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

let sessionConfig = {
  name: "SESS_NAME",
  secret: config?.COOKIE_KEY_1 || "secret",
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

let cspOptions = {
  policies: {
    "default-src": [
      SELF,
      // Add a allowed domains
      "http://localhost:3000",
      "studio.apollographql.com",
    ],
    "connect-src": [SELF],
  },
};

// Define the log file path
const logFilePath = path.join(__dirname, "..", "logs", "access.log");

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

module.exports = {
  isDevelopment,
  corsOptions,
  cspOptions,
  config,
  sessionConfig,

  logger,
  accessLogStream,
  logFilePath,
  CLIENT_ENDPOINT,
  SERVER_ENDPOINT,
};
