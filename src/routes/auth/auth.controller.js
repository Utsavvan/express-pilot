const { random } = require("@Config/helperFunctions");

const {
  findUserById,
  updateUserById,
  findUserByMail,
  insertUser,

  readAllUsers,
} = require("@Models/users/users.model");

const { CLIENT_ENDPOINT } = require("@Config/helperVariables");

async function requestOtp(req, res) {
  try {
    const { email } = req.body;

    const userDetails = await findUserByMail(email);

    // if user exist
    if (userDetails.success) {
      const { data } = userDetails;

      if (data?.isDeleted) {
        return res.status(403).json({
          success: false,
          error:
            "Your account is blocked or deleted .For further information ,Please contact the administrator.",
        });
      }

      // Generate a random OTP
      const OTP = random(1111, 9999);

      const userUpdateDetails = await updateUserById(data._id, {
        otpVerified: false,
        otpSecret: OTP,
      });

      // if OTP is inserted
      if (userUpdateDetails.success) {
        try {
          let mailResult = await sendTemplateEmail(email, "otpVerification", {
            OTP,
          });

          if (mailResult.success) {
            return res
              .status(200)
              .json({ success: true, message: "OTP sent successfully" });
          } else {
            return res
              .status(400)
              .json({ success: true, error: "OTP not sent" });
          }
        } catch (error) {
          console.error("Error sending email:", error);
          return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
        }
      }
    } else {
      return res.status(404).json(userDetails);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    // Retrieve user from the database using userId
    const user = await findUserByMail(email);

    if (!user.success) {
      return res.status(404).json(user.data);
    }

    const { data } = user;

    if (data?.isDeleted) {
      return res.status(403).json({
        success: false,
        error:
          "Your account is blocked or deleted .For further information ,Please contact the administrator.",
      });
    }

    if (data.otpAttempts >= 5) {
      let updatedData = await updateUserById(data._id, {
        isDeleted: true,
      });

      if (updatedData.success) {
        return res.status(403).json({
          success: false,
          error:
            "Too many attempts. Your account is temporarily blocked. Please contact the administrator.",
        });
      }
    }

    // Check if the time since the last attempt is within the allowed limit (e.g., 5 minutes)
    const currentTime = new Date();
    const lastAttemptTime = user.lastOtpAttempt || new Date(0);
    const timeDifference = currentTime - lastAttemptTime;
    const timeLimit = 5 * 60 * 1000;

    if (timeDifference < timeLimit) {
      return res.status(403).json({
        success: false,
        error: "Too many attempts in short time. Try again later.",
      });
    }

    // Verify the entered OTP against the stored OTP
    if (data.otpSecret && data.otpSecret == otp && !data.otpVerified) {
      let updatedData = await updateUserById(data._id, {
        otpVerified: true,
        otpSecret: null,
        otpAttempts: 0,
        lastOtpAttempt: currentTime,
      });

      if (updatedData.success) {
        passport.authenticate("local", {
          failureRedirect: `${CLIENT_ENDPOINT}/unauthorized`,
          session: true,
        })(req, res, next);

        // return res.status(200).json({
        //   success: true,
        //   message: "OTP verified successfully",
        // });
      }
    } else {
      let newAttemptCount = data.otpAttempts + 1;

      await updateUserById(data._id, {
        otpVerified: false,
        otpAttempts: newAttemptCount,
        lastOtpAttempt: currentTime,
      });

      return res.status(400).json({
        success: false,
        error: `Invalid OTP , ${5 - newAttemptCount} attempts is remaining`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function localCallbackController(req, res) {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function googleCallbackController(req, res) {
  console.log("Google called us back!");
}

async function logoutController(req, res) {
  try {
    await updateUserById(req.user._id, {
      otpSecret: "",
      otpVerified: false,
    });

    req.logout();

    res.redirect(CLIENT_ENDPOINT);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const { userData } = req.body;

    const userInsertResult = await insertUser(userData);

    if (userInsertResult.success) {
      res.status(200).json({ ...userInsertResult });
    } else {
      res.status(500).json({ ...userInsertResult });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function viewUserList(req, res) {
  try {
    let userList = await readAllUsers();

    if (!userList?.success) {
      return res.status(404).json({ ...userList });
    }
    return res.status(200).json({ ...userList });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = {
  requestOtp,
  verifyOtp,
  localCallbackController,
  googleCallbackController,
  logoutController,
  createUser,
  viewUserList,
};
