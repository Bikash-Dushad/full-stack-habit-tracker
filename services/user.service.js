const UserModel = require("../models/user.schema");
const HabitModel = require("../models/habit.schema");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const mongoose = require("mongoose");
const { createToken } = require("../utils/token.handler");
const {
  signupValidation,
  createHabitValidation,
  toggleHabitValidation,
} = require("../validators/user.validator");
const { datesTillSaturday } = require("../helper/helper");
const { cloudinary } = require("../config/cloudnary");
const streamifier = require("streamifier");

const imageUploadService = async (file) => {
  if (!file) throw new Error("file is required");
  const originalName = file.originalname
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  const fileName = `${Date.now()}-${originalName}`;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: fileName,
        folder: "habit-tracker",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const signupService = async (payload) => {
  const { name, email, avatar, password, confirmPassword } = payload;
  const { error } = signupValidation.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const user = await UserModel.findOne({
    email,
    isActive: true,
    isDeleted: false,
  });
  if (user) {
    throw new Error("User already exists, please singin");
  }
  if (password !== confirmPassword) {
    throw new Error("Password and confirm password should be same");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    avatar,
  });
  return newUser;
};

const signInService = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User not found with this email");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("password not matched");
  }
  const tokenPayload = {
    id: user.id,
  };
  let token = createToken(tokenPayload);
  const data = {
    token,
  };
  return data;
};

const listOfOffDaysDropdownService = async () => {
  const offDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return offDays;
};

const createHabitService = async (payload) => {
  const { userId, name, offDays } = payload;
  const { error } = createHabitValidation.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }
  const habit = await HabitModel.findOne({
    user: userId,
    name,
    isActive: true,
    isDeleted: false,
  });

  if (habit) {
    throw new Error("Habit already exists");
  }
  const metadata = datesTillSaturday(offDays);

  const newHabit = new HabitModel({
    user: userId,
    name,
    offDays,
    metadata,
  });
  await newHabit.save();
  return newHabit;
};

const listOfHabitsService = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }
  const weekStart = moment.utc().startOf("week").toDate(); // Sunday
  const weekEnd = moment.utc().endOf("week").toDate(); // Saturday

  const weekStartFormatted = moment(weekStart).format("YYYY-MM-DD");
  const weekEndFormatted = moment(weekEnd).format("YYYY-MM-DD");

  console.log("Week Start:", weekStartFormatted);
  console.log("Week End:", weekEndFormatted);

  const habits = await HabitModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isActive: true,
        isDeleted: false,
      },
    },
    {
      $addFields: {
        metadata: {
          $filter: {
            input: "$metadata",
            as: "entry",
            cond: {
              $and: [
                { $gte: ["$$entry.date", weekStart] },
                { $lte: ["$$entry.date", weekEnd] },
              ],
            },
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return habits;
};

const toggleHabitService = async (payload) => {
  const { habitId, userId, status, metadataId } = payload;

  const { error } = toggleHabitValidation.validate(payload);
  if (error) throw new Error(error.details[0].message);

  const habit = await HabitModel.findOne(
    {
      _id: habitId,
      user: userId,
      isActive: true,
      isDeleted: false,
      "metadata._id": metadataId,
    },
    {
      name: 1,
      offDays: 1,
      metadata: { $elemMatch: { _id: metadataId } },
    },
  );
  if (!habit) {
    throw new Error("Habit or metadata not found");
  }
  console.log(habit);

  const metadata = habit.metadata.id(metadataId);
  const todayStart = moment.utc().startOf("day").toDate();
  const todayEnd = moment.utc().endOf("day").toDate();
  if (metadata.date < todayStart || metadata.date > todayEnd) {
    throw new Error("Only update today's task");
  }
  if (metadata.isOffDay) {
    throw new Error("Cannot update an off day task");
  }
  metadata.status = status;
  await habit.save();
  return habit;
};

const deleteHabitService = async (payload) => {
  const { habitId, userId } = payload;
  if (!habitId || !userId) {
    throw new Error("Habit id and userId is required");
  }
  const habit = await HabitModel.findOne({
    _id: habitId,
    user: userId,
    isActive: true,
    isDeleted: false,
  });
  if (!habit) {
    throw new Error("Habit not found");
  }
  habit.isActive = false;
  habit.isDeleted = true;
  await habit.save();
  return habit;
};

const getSingleHabitService = async (payload) => {
  const { habitId, userId } = payload;
  if (!habitId || !userId) {
    throw new Error("Habit Id and userId are required");
  }
  const habit = await HabitModel.findOne({
    _id: habitId,
    user: userId,
    isActive: true,
    isDeleted: false,
  });
  if (!habit) {
    throw new Error("Habit not founc");
  }
  return habit;
};

const getUserProfileService = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const userDetails = await UserModel.findById(userId).select("-password");
  if (!userDetails) {
    throw new Error("User not found");
  }
  return userDetails;
};

const getTotalUsersService = async () => {
  const totalUsers = await UserModel.countDocuments({});
  return totalUsers;
};

module.exports = {
  imageUploadService,
  signupService,
  signInService,
  listOfOffDaysDropdownService,
  createHabitService,
  listOfHabitsService,
  toggleHabitService,
  deleteHabitService,
  getSingleHabitService,
  getUserProfileService,
  getTotalUsersService,
};
