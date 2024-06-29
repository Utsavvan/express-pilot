const path = require("path");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const session = require("express-session");
const { expressCspHeader } = require("express-csp-header");

const {
  isDevelopment,
  cspOptions,
  corsOptions,
  sessionConfig,
  accessLogStream,
} = require("@Config/helperVariables");

const errorMiddleware = require("@Middlewares/errors.middleware");
const loggerMiddleware = require("@Middlewares/logger.middleware");

const exampleRouter = require("@Routes/example/example.routes.js");

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

/************ Custom moddlewares ************/

app.use(errorMiddleware);
// A middleware to capture logs from controllers and direct them to Winston
app.use(loggerMiddleware);

// set main router for whole app
const mainRouter = express.Router();
app.use("/api", mainRouter);

/************ App routers ************/
// define api routes here

mainRouter.use("/example", exampleRouter);

module.exports = app;
