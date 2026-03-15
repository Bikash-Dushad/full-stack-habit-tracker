const userRouter = require("./user.router");
const OAuthRouter = require("./OAuth.router");

const routes = [
  { path: "/user", router: userRouter },
  { path: "/OAuth", router: OAuthRouter },
];

module.exports = routes;
