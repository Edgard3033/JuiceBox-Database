const express = require("express");
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log("A request was made to /users");

  next();
});

const { getAllUsers } = require("../db");

usersRouter.get("/", async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users: [],
  });
});

module.exports = usersRouter;
