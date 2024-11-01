const path = require("path");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const session = require("express-session");
const { expressCspHeader } = require("express-csp-header");
const passport = require("passport");

const {
  isDevelopment,
  cspOptions,
  corsOptions,
  sessionConfig,
  accessLogStream,
} = require("@Config/helperVariables");
const { default: PassportSetup } = require("@Services/passport");

const errorMiddleware = require("@Middlewares/errors.middleware");
const checkLoggedInMiddleware = require("@Middlewares/auth.middleware");

const exampleRouter = require("@Routes/example/example.routes.js");
const AuthRouter = require("@Routes/auth/auth.routes");

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
app.use(passport.initialize());
app.use(passport.session());

// Override console.log to capture logs
console.log = function (...args) {
  logger.info(args.join(" "));
};
console.error = function (...args) {
  logger.error(args.join(" "));
};

if (!isDevelopment) {
  app.use("/graphql", checkLoggedInMiddleware);
}

// set main router for whole app
const mainRouter = express.Router();
app.use("/api", mainRouter);

// capture a errors
app.use(errorMiddleware);

/************ App routers ************/
// define api routes here

mainRouter.use("/example", exampleRouter);
mainRouter.use("/auth", AuthRouter);

module.exports = app;
