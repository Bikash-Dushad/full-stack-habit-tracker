const Joi = require("joi");

const signupValidation = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must not exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),
  avatar: Joi.string().allow("").optional().default("").messages({
    "string.uri": "Avatar must be a valid URI",
    "string.base": "Avatar must be a string",
  }),
  password: Joi.string()
    .min(6)
    .max(20)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must not exceed 20 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),
  confirmPassword: Joi.string()
    .min(6)
    .max(20)
    .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Confirm password must be at least 6 characters long",
      "string.max": " Confirm Password must not exceed 20 characters",
      "string.pattern.base":
        " Confirm Password must contain at least one uppercase letter, one number, and one special character",
      "any.required": "Confirm Password is required",
    }),
});

const createHabitValidation = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),

  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Habit name is required",
    "string.min": "Habit name must be at least 2 characters",
    "string.max": "Habit name must not exceed 100 characters",
  }),

  offDays: Joi.array()
    .items(
      Joi.string().valid(
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ),
    )
    .default([]),
});

const toggleHabitValidation = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),
  habitId: Joi.string().required().messages({
    "string.empty": "Habit ID is required",
    "any.required": "Habit ID is required",
  }),
  metadataId: Joi.string().required().messages({
    "string.empty": "metadata is required",
    "any.required": "metadata is required",
  }),
  status: Joi.boolean().required().messages({
    "boolean.base": "Status must be true or false",
    "any.required": "Status is required",
  }),
});

module.exports = {
  signupValidation,
  createHabitValidation,
  toggleHabitValidation,
};
