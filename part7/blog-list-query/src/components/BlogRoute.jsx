import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";

const BlogRoute = ({ blog }) => {
  const queryClient = useQueryClient();
  const [notification, notificationDispatch] = useContext(NotificationContext);

  const likeBlogMutation = useMutation({
    mutationFn: blogService.likeBlog,
    onSuccess: (likedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => {
          console.log(blog);
          return blog.id === likedBlog.id ? likedBlog : blog;
        }),
      );
    },
    onError: (error) => {
      notificationDispatch({
        type: "setMessage",
        payload: {
          message: `error: ${error.response.data.error}`,
          seconds: 5,
          isAlert: true,
        },
      });
    },
  });

  const handleLike = (blog) => {
    likeBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
    notificationDispatch({
      type: "setMessage",
      payload: {
        message: `liked blog ${blog.title}`,
        seconds: 5,
        isAlert: false,
      },
    });
  };

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        <span>
          {blog.likes} likes{" "}
          <button onClick={() => handleLike(blog)}>like</button>
        </span>
      </div>
      <div>added by {blog.user.name}</div>
    </div>
  );
};

export default BlogRoute;