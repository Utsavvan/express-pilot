const express = require("express");
const passport = require("passport");

const {
  requestOtp,
  verifyOtp,
  localCallbackController,
  googleCallbackController,
  logoutController,
} = require("./auth.controller");

const { CLIENT_ENDPOINT } = require("@Config/helperVariables");
const checkLoggedInMiddleware = require("@Middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/request-otp", requestOtp);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: `${CLIENT_ENDPOINT}/unauthorized`,
    session: true,
  }),
  localCallbackController
);

authRouter.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "No user found",
    });
  }
});

authRouter.get(
  "/google",
  (req, res, next) => {
    // If the user is already authenticated, redirect to success page
    if (req.isAuthenticated()) {
      return res.redirect(CLIENT_ENDPOINT);
    }
    // If not authenticated, continue to Google authentication
    next();
  },
  passport.authenticate("google")
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_ENDPOINT}/unauthorized`,
    successRedirect: `${CLIENT_ENDPOINT}/`,
    session: true,
  }),
  googleCallbackController
);

authRouter.get("/logout", logoutController);

module.exports = authRouter;
