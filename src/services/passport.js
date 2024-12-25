const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  findUserById,
  upsertUserDetails,
  findUserByMail,
  getEmailsForAllUsers,
} = require("@Models/users/users.model");

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};

const GOOGLE_AUTH_OPTIONS = {
  callbackURL: "/api/auth/google/callback",
  clientID: config.CLIENT_ID || "0",
  clientSecret: config.CLIENT_SECRET || "0",
  scope: ["email", "profile"],
};

async function verifyGoogleCallback(accessToken, refreshToken, profile, done) {
  try {
    const userDetails = await upsertUserDetails(
      profile,
      accessToken,
      refreshToken
    );

    if (userDetails.data.isDeleted) {
      return done(null, false, { message: "Unauthorized email address" });
    }

    if (userDetails.success) {
      return done(null, userDetails.data);
    } else {
      return done("Something went wrong", null);
    }
  } catch (error) {
    return done(error, null);
  }
}

passport.use(new GoogleStrategy(GOOGLE_AUTH_OPTIONS, verifyGoogleCallback));

const LOCAL_AUTH_OPTIONS = {
  usernameField: "email",
  passwordField: "otp",
  passReqToCallback: true,
};

async function verifyLocalCallback(req, username, password, done) {
  try {
    const { email } = req.body;

    const userDetails = await findUserByMail(email);

    if (userDetails.success && userDetails.data.otpVerified) {
      done(null, userDetails.data);
    } else {
      done(null, false);
    }
  } catch (error) {
    console.log(error);
    return done(error);
  }
}

passport.use(new LocalStrategy(LOCAL_AUTH_OPTIONS, verifyLocalCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
  process.nextTick(function () {
    return done(null, user._id);
  });
});

// Read the session from the cookie
passport.deserializeUser(async (id, done) => {
  process.nextTick(async function () {
    try {
      const userData = await findUserById(id);

      if (userData.success) {
        done(null, userData.data);
      }
    } catch (error) {
      console.log(error);
      done(error, null);
    }
  });
});

module.exports = passport;
