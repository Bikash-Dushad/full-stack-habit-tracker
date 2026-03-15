const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { googleAuth } = require("../controllers/OAuth.controller");
const OAuth = express.Router();

OAuth.post("/google-auth", googleAuth);

module.exports = OAuth;
