const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const listWithMoreThanOneBlog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

const listWithoutBlogs = [];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list is empty, equals the likes of zero", () => {
    const result = listHelper.totalLikes(listWithoutBlogs);
    assert.strictEqual(result, 0);
  });

  test("when list has more than one blog, equals the likes of the sum of them", () => {
    const result = listHelper.totalLikes(listWithMoreThanOneBlog);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, returns that blog's data", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
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
    const result = listHelper.favoriteBlog(listWithMoreThanOneBlog);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("author with most blogs", () => {
  test("when list has only one blog, returns that author with the count of 1 blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
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
    const result = listHelper.mostBlogs(listWithMoreThanOneBlog);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("author with most likes", () => {
  test("when list has only one blog, returns that author with the like count", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
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
    const result = listHelper.mostLikes(listWithMoreThanOneBlog);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
