const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);
let token = undefined;

beforeEach(async () => {
  await Blog.deleteMany({});

  const testUser = await User.findOne({ username: "root" });
  const userForToken = {
    username: testUser.username,
    id: testUser._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET);

  let blogObject = new Blog(helper.listWithMoreThanOneBlog[0]);
  blogObject.user = testUser.id;
  await blogObject.save();
  testUser.blogs = testUser.blogs.concat(blogObject._id);

  blogObject = new Blog(helper.listWithMoreThanOneBlog[1]);
  blogObject.user = testUser.id;
  await blogObject.save();
  testUser.blogs = testUser.blogs.concat(blogObject._id);

  await testUser.save();
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
    .set("Authorization", `Bearer ${process.env.TOKEN}`)
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

test("adding a blog will fail with 401 if the token is not provided", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const newBlog = {
    title: "Premature refactoring is the root of many bad things",
    author: "Nicolas Carlo",
    url: "https://understandlegacycode.com/blog/refactoring-rule-of-three/#:~:text=Premature%20refactoring%20is%20the%20root,You're%20onto%20something",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(401);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

  const titles = blogsAtEnd.map((n) => n.title);
  assert(
    !titles.includes("Premature refactoring is the root of many bad things"),
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
    .set("Authorization", `Bearer ${token}`)
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
    .set("Authorization", `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400);

  let totalBlogs = await helper.blogsInDb();

  assert.strictEqual(totalBlogs.length, 2);

  const newBlogWithoutURL = {
    title: "Math for game developers",
    author: "Pikuma",
    likes: 0,
  };

  response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlogWithoutURL)
    .expect(400);

  totalBlogs = await helper.blogsInDb();
  assert.strictEqual(totalBlogs.length, 2);

  const newBlogWithoutURLAndTitle = {
    author: "Pikuma",
    likes: 0,
  };

  response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlogWithoutURLAndTitle)
    .expect(400);

  totalBlogs = await helper.blogsInDb();
  assert.strictEqual(totalBlogs.length, 2);
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    //console.log("titles", titles);
    assert(!titles.includes(blogToDelete.title));
  });

  test("fails with status code 404 if the blog to delete doesn't exist", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogDoesntExist = new Blog(helper.listWithMoreThanOneBlog[3]);

    await api
      .delete(`/api/blogs/${blogDoesntExist.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);

    const titles = blogsAtEnd.map((r) => r.title);
    //console.log("titles", titles);
    assert(!titles.includes(blogDoesntExist.title));
  });
});

describe("updating a blog", () => {
  test("succeeds with status code 200 if the blog to update exists", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ likes: 200 })
      .expect(200);

    assert.strictEqual(response.body.likes, 200);
  });

  test("fails with status code 400 if the blog to update doesn't exists", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = new Blog(helper.listWithMoreThanOneBlog[2]);

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 200 })
      .expect(400);

    const titles = blogsAtStart.map((r) => r.title);
    //console.log("titles", titles);
    assert(!titles.includes(blogToUpdate.title));
  });
});

after(async () => {
  await mongoose.connection.close();
});