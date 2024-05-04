const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
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

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  if (request.body.id === undefined) {
    blog.likes = 0;
  }

  if (request.body.title === undefined || request.body.url === undefined) {
    response.status(400).end();
  } else {
    const savedBlog = await blog.save();
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
