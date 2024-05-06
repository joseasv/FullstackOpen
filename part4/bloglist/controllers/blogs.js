const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  //const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.id === undefined ? 0 : body.id,
    user: user.id,
  });

  console.log("random user", user);

  if (request.body.title === undefined || request.body.url === undefined) {
    response
      .status(400)
      .json({
        error: "title and url must not be blank",
      })
      .end();
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const deletedBlog = await Blog.findOneAndDelete({ _id: request.params.id });

  if (deletedBlog) {
    response.status(204).json(deletedBlog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const newLikes = request.body.likes;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: newLikes },
    { new: true },
  );

  if (updatedBlog) {
    response.status(200).json(updatedBlog);
  } else {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
