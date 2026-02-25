const userRouter = require("./user.router");

const routes = [
  { path: "/user", router: userRouter },
];

module.exports = routes;
