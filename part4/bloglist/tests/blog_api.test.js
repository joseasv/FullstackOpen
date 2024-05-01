const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.listWithMoreThanOneBlog[0]);
  await blogObject.save();

  blogObject = new Blog(helper.listWithMoreThanOneBlog[1]);
  await blogObject.save();
});

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");

  //console.log("response on first test", response);

  assert.strictEqual(response.body.length, 2);
});

test("checking the unique identifier is named id", async () => {
  const response = await api.get(
    `/api/blogs/${helper.listWithMoreThanOneBlog[0]._id}`,
  );

  assert.ok("id" in response.body);
});

after(async () => {
  await mongoose.connection.close();
});