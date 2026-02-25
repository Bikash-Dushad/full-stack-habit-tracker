let jwt = require("jsonwebtoken");

const createToken = (tokenPayload) => {
  return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
};

module.exports = {
  createToken,
};
