const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_helper");
const api = supertest(app);
//...

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper status code if username and password are not given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserNoUsername = {
      name: "Superuser",
      password: "salainen",
    };

    let result = await api
      .post("/api/users")
      .send(newUserNoUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    let usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes("username and password cannot be blank"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    const newUserNoPassword = {
      username: "root",
      name: "Superuser",
    };

    result = await api
      .post("/api/users")
      .send(newUserNoPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes("username and password cannot be blank"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    const newUserNoUsernameNoPassword = {
      name: "Superuser",
    };

    result = await api
      .post("/api/users")
      .send(newUserNoUsernameNoPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    usersAtEnd = await helper.usersInDb();

    assert(result.body.error.includes("username and password cannot be blank"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});