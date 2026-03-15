const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    googleProfilePicture: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = new mongoose.model("User", UserSchema);
