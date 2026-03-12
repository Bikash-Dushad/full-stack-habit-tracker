const {
  signupService,
  signInService,
  createHabitService,
  toggleHabitService,
  listOfHabitsService,
  listOfOffDaysDropdownService,
  getUserProfileService,
  getTotalUsersService,
} = require("../services/user.service");
const { handleError } = require("../utils/error.handler");

const signup = async (req, res) => {
  try {
    const payload = req.body;
    const data = await signupService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: `User with name ${data.name} created successfully`,
      data,
    });
  } catch (error) {
    return handleError(res, error, "signup");
  }
};

const signIn = async (req, res) => {
  try {
    const payload = req.body;
    const data = await signInService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: "Sign in successfull",
      data,
    });
  } catch (error) {
    return handleError(res, error, "signIn");
  }
};

const listOfOffDaysDropdown = async (req, res) => {
  try {
    const data = await listOfOffDaysDropdownService();
    return res.status(200).json({
      responseCode: 200,
      message: "Off Days fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "listOfOffDaysDropdown");
  }
};

const createHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = req.body;
    payload.userId = userId;
    const data = await createHabitService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: "Habit created successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "createHabit");
  }
};

const listOfHabits = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await listOfHabitsService(userId);
    return res.status(200).json({
      responseCode: 200,
      message: "List of habits fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "listOfHabits");
  }
};

const toggleHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const payload = req.body;
    payload.userId = userId;
    const data = await toggleHabitService(payload);
    return res.status(200).json({
      responseCode: 200,
      message: "Habit updated successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "toggleHabit");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await getUserProfileService(userId);
    return res.status(200).json({
      responseCode: 200,
      message: "user details fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "getUserDetails");
  }
};

const totalUsers = async (req, res) => {
  try {
    const data = await getTotalUsersService();
    return res.status(200).json({
      responseCode: 200,
      message: "total Users fetched successfully",
      data,
    });
  } catch (error) {
    return handleError(res, error, "totalUsers");
  }
};

module.exports = {
  signup,
  signIn,
  listOfOffDaysDropdown,
  createHabit,
  listOfHabits,
  toggleHabit,
  getUserProfile,
  totalUsers,
};
