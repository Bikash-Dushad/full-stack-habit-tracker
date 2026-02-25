const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    offDays: {
      type: [String],
      default: [],
    },
    metadata: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: Boolean,
        },
        isOffDay: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
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

module.exports = new mongoose.model("Habit", HabitSchema);
