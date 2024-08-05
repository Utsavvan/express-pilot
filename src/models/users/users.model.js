const Users = require("./users.mongo");

async function findUserById(id) {
  try {
    const userDetails = await Users.findById(id).lean();

    if (!userDetails) {
      return {
        success: false,
        error: "User is not found",
      };
    }

    return {
      success: true,
      data: userDetails,
      message: "User is found",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function insertUser(data) {
  try {
    const userDetails = await Users.create(data);

    if (!userDetails) {
      return {
        success: false,
        error: "User is not created",
      };
    }

    return {
      success: true,
      data: userDetails,
      message: "User is created",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function updateUserById(id, updatedata) {
  try {
    const userDetails = await Users.findOneAndUpdate({ _id: id }, updatedata, {
      new: true,
    }).lean();

    if (!userDetails) {
      return {
        success: false,
        error: "User is not found",
      };
    }

    return {
      success: true,
      data: userDetails,
      message: "User is found",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function findUserByMail(email) {
  try {
    const userDetails = await Users.findOne({ email }).lean();

    if (!userDetails) {
      return {
        success: false,
        error: "User is not found",
      };
    }

    return {
      success: true,
      data: userDetails,
      message: "User is found",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getEmailsForAllUsers() {
  try {
    const userMails = await Users.find({}, "email").lean();

    if (!userMails) {
      return {
        success: false,
        error: "Error fetching a users",
      };
    }

    return {
      success: true,
      data: userMails,
      message: "User mails are found",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// insert user or update a current one
async function upsertUserDetails(profile, accessToken, refreshToken) {
  try {
    const userDetails = await Users.findOneAndUpdate(
      {
        $or: [
          { "oauth.provider": "google", "oauth.providerId": profile.id },
          { email: profile.emails[0].value },
        ],
      },
      {
        $set: {
          oauth: [
            {
              provider: "google",
              providerId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
          ],
          email: profile.emails[0].value,
          displayName: profile.displayName,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (!userDetails) {
      return {
        success: false,
        error: "User is not Inserted",
      };
    }

    return {
      success: true,
      data: userDetails,
      message: "User is found",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function readAllUsers() {
  try {
    const customerList = await Users.find({}).select({
      email: 1,
      displayName: 1,
      accessLevel: 1,
    });

    if (!customerList) {
      return {
        success: false,
        message: "Users list not found",
      };
    }

    return {
      success: true,
      data: customerList,
      message: "Users list found",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = {
  findUserById,
  updateUserById,
  upsertUserDetails,
  findUserByMail,
  insertUser,
  readAllUsers,
  getEmailsForAllUsers,
};
