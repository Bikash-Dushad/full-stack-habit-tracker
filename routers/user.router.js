const express = require("express");
const {
  signup,
  signIn,
  createHabit,
  toggleHabit,
  listOfHabits,
  listOfOffDaysDropdown,
  getUserProfile,
  totalUsers,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signIn);
userRouter.get("/list-of-off-days-dropdown", listOfOffDaysDropdown);
userRouter.post("/create-habit", authMiddleware, createHabit);
userRouter.get("/list-of-habit", authMiddleware, listOfHabits);
userRouter.post("/toggle-habit", authMiddleware, toggleHabit);
userRouter.get("/get-user-profile", authMiddleware, getUserProfile);
userRouter.get("/get-total-users", totalUsers);

module.exports = userRouter;
