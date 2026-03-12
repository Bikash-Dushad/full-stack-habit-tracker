const cron = require("node-cron");
const mongoose = require("mongoose");
const HabitModel = require("../models/habit.schema");
const { datesTillSaturday } = require("../helper/helper");

const addDatesToHabit = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log(`[${new Date().toISOString()}] Database not connected.`);
      return;
    }
    const habits = await HabitModel.find(
      { isActive: true, isDeleted: false },
      { _id: 1, offDays: 1 },
    ).lean();

    const bulkOps = habits.map((habit) => ({
      updateOne: {
        filter: { _id: habit._id },
        update: {
          $push: {
            metadata: { $each: datesTillSaturday(habit.offDays) },
          },
        },
      },
    }));

    const result = await HabitModel.bulkWrite(bulkOps, { ordered: false });
    console.log("DB updated successfully", result);
  } catch (error) {
    throw new Error(error);
  }
};

// cron.schedule("7 0 * * 0", addDatesToHabit, { timezone: "UTC" });
// cron.schedule("* * * * *", addDatesToHabit, { timezone: "UTC" });
module.exports = {
  addDatesToHabit,
};
