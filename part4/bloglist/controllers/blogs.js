const blogsRouter = require("express").Router();
const middleware = require("../utils/middleware");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { text: 1 });
  //console.log(blogs);
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

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.id === undefined ? 0 : body.id,
    user: user,
  });

  console.log("blog data to be added", blog);

  if (
    request.body.title === undefined ||
    request.body.url === undefined ||
    request.body.title.length === 0 ||
    request.body.url.length === 0
  ) {
    response
      .status(400)
      .json({
        error: "title and url must not be blank",
      })
      .end();
  } else {
    const savedBlog = await blog.save();
    console.log("savedBlog", savedBlog);
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blogToDelete = await Blog.findById({ _id: request.params.id });

    if (blogToDelete) {
      if (blogToDelete.user.toString() === user.id.toString()) {
        const deletedBlog = await Blog.findOneAndDelete({
          _id: request.params.id,
        });
        console.log("deletedBlog ", deletedBlog);
        response.status(204).end();
      }
    } else {
      response.status(404).end();
    }
  },
);

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const newLikes = request.body.likes;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      likes: newLikes,
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      user: user,
    },
    { new: true },
  ).populate("user", { username: 1, name: 1 });

  if (updatedBlog) {
    response.status(200).json(updatedBlog).end();
  } else {
    response.status(400).end();
  }
});

blogsRouter.put("/:id/comments", async (request, response) => {
  console.log("adding comment");
  const commentText = request.body.comment;

  console.log("comment to add ", commentText);
  const commentedBlog = await Blog.findById({ _id: request.params.id });

  console.log("commented blog ", commentedBlog);

  const newComment = new Comment({ text: commentText, blog: commentedBlog });
  console.log("newComment model ", newComment);

  await newComment.save();

  if (commentedBlog) {
    //commentedBlog.comments = commentedBlog.comments.concat(newComment._id);
    commentedBlog.comments.push(newComment);

    await commentedBlog.save();

    response.status(200).json(commentedBlog).end();
  } else {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
