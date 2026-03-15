const UserModel = require("../models/user.schema");
const { OAuth2Client } = require("google-auth-library");
const { createToken } = require("../utils/token.handler");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthService = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, name, picture, sub } = payload;

  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      name,
      email,
      avatar: picture,
      provider: "google",
      provider: "google",
      googleId: sub,
    });
  } else {
    user.provider = "google";
    user.googleProfilePicture = picture;
    user.googleId = sub;
    await user.save();
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

module.exports = {
  googleAuthService,
};
