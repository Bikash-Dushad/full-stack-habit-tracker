const express = require("express");
const app = express();
const cors = require("cors");
require("./cron-jobs/cronJobs");
const connectDB = require("./config/db");
const routes = require("./routers");

const dotenv = require("dotenv");
dotenv.config();

app.use(cors());

app.use(express.json());

routes.forEach(({ path, router }) => {
  app.use(`/api${path}`, router);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date(),
  });
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
