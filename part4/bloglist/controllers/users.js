const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (username !== undefined && password !== undefined) {
    if (username.length > 2 && password.length > 2) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        username,
        name,
        passwordHash,
      });

      const savedUser = await user.save();

      response.status(201).json(savedUser);
    } else {
      return response.status(400).json({
        error: "username and password must be at least 3 characters long",
      });
    }
  } else {
    return response
      .status(400)
      .json({ error: "username and password cannot be blank" });
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    url: 1,
    author: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
