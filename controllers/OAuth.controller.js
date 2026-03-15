const { googleAuthService } = require("../services/OAuth.service");
const { handleError } = require("../utils/error.handler");

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    const data = await googleAuthService(credential);
    return res.status(200).json({
      responseCode: 200,
      message: "Login successfull",
      data,
    });
  } catch (error) {
    return handleError(res, error, "googleAuth");
  }
};

module.exports = {
  googleAuth,
};
