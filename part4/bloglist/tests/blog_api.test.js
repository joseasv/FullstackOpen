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

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "Premature refactoring is the root of many bad things",
    author: "Nicolas Carlo",
    url: "https://understandlegacycode.com/blog/refactoring-rule-of-three/#:~:text=Premature%20refactoring%20is%20the%20root,You're%20onto%20something",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, 3);

  const titles = blogsAtEnd.map((n) => n.title);
  assert(
    titles.includes("Premature refactoring is the root of many bad things"),
  );
});

test("if the likes property is missing it will default to zero", async () => {
  const newBlogWithoutLikes = {
    title: "Math for game developers",
    author: "Pikuma",
    url: "https://pikuma.com/blog/math-for-game-developers",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("if the title or url properties are missing the server will respond with 400 Bad Request", async () => {
  const newBlogWithoutTitle = {
    author: "Pikuma",
    url: "https://pikuma.com/blog/math-for-game-developers",
    likes: 0,
  };

  let response = await api
    .post("/api/blogs")
    .send(newBlogWithoutTitle)
    .expect(400);

  assert.deepStrictEqual(response.body, {});

  const newBlogWithoutURL = {
    title: "Math for game developers",
    author: "Pikuma",
    likes: 0,
  };

  response = await api.post("/api/blogs").send(newBlogWithoutURL).expect(400);

  assert.deepStrictEqual(response.body, {});

  const newBlogWithoutURLAndTitle = {
    author: "Pikuma",
    likes: 0,
  };

  response = await api
    .post("/api/blogs")
    .send(newBlogWithoutURLAndTitle)
    .expect(400);

  assert.deepStrictEqual(response.body, {});
});

after(async () => {
  await mongoose.connection.close();
});