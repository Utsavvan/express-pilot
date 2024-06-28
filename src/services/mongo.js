const mongoose = require("mongoose");

const MONGO_URL =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_MONGO_URL
    : process.env.LIVE_MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is Ready");
});

mongoose.connection.once("error", (err) => {
  console.log(`MongoDB error ${err}`);
});

async function mongoConnect(customMongoURL = null) {
  const urlToUse = customMongoURL || MONGO_URL;

  if (urlToUse) {
    await mongoose.connect(urlToUse);
  }
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
  MONGO_URL,
};
