const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");

const listWithoutBlogs = [];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list is empty, equals the likes of zero", () => {
    const result = listHelper.totalLikes(listWithoutBlogs);
    assert.strictEqual(result, 0);
  });

  test("when list has more than one blog, equals the likes of the sum of them", () => {
    const result = listHelper.totalLikes(helper.listWithMoreThanOneBlog);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, returns that blog's data", () => {
    const result = listHelper.favoriteBlog(helper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list is empty, return an empty object", () => {
    const result = listHelper.favoriteBlog(listWithoutBlogs);
    assert.deepStrictEqual(result, {});
  });

  test("when list has more than one blog, returns the blog's data with the most likes", () => {
    const result = listHelper.favoriteBlog(helper.listWithMoreThanOneBlog);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("author with most blogs", () => {
  test("when list has only one blog, returns that author with the count of 1 blog", () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("when list is empty, return an empty object", () => {
    const result = listHelper.mostBlogs(listWithoutBlogs);
    assert.deepStrictEqual(result, {});
  });

  test("when list has more than one blog, returns the author with the most blogs and their blog count", () => {
    const result = listHelper.mostBlogs(helper.listWithMoreThanOneBlog);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("author with most likes", () => {
  test("when list has only one blog, returns that author with the like count", () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list is empty, return an empty object", () => {
    const result = listHelper.mostLikes(listWithoutBlogs);
    assert.deepStrictEqual(result, {});
  });

  test("when list has more than one blog, returns the author with the most likes and their like count", () => {
    const result = listHelper.mostLikes(helper.listWithMoreThanOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
