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
  imageUpload,
  dashboard,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const userRouter = express.Router();
let multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter.post("/signup", signup);
userRouter.post("/signin", signIn);
userRouter.get("/list-of-off-days-dropdown", listOfOffDaysDropdown);
userRouter.post("/create-habit", authMiddleware, createHabit);
userRouter.get("/list-of-habit", authMiddleware, listOfHabits);
userRouter.post("/toggle-habit", authMiddleware, toggleHabit);
userRouter.get("/get-user-profile", authMiddleware, getUserProfile);
userRouter.get("/get-total-users", totalUsers);
userRouter.post("/image-upload", upload.single("file"), imageUpload);
userRouter.get("/dashboard", authMiddleware, dashboard);

module.exports = userRouter;
