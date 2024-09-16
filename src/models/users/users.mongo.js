const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, default: "" },
    email: { type: String, unique: true, required: true },
    displayName: { type: String, default: "" },
    oauth: [
      {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
        accessToken: { type: String, required: true },
        refreshToken: { type: String },
      },
    ],
    otpSecret: { type: String, default: 0 },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    lastOtpAttempt: {
      type: Date,
    },
    accessLevel: {
      type: Number,
      default: 2,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;
