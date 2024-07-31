import Blog from "./Blog";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserState } from "../UserContext";
import blogService from "../services/blogs";

const BlogList = ({ blogs }) => {
  const queryClient = useQueryClient();
  const userData = useUserState();
  const [notification, notificationDispatch] = useContext(NotificationContext);

  const removeBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (deletedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
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

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogMutation.mutate(blog);
      notificationDispatch({
        type: "setMessage",
        payload: {
          message: `removed blog ${blog.title}`,
          seconds: 5,
          isAlert: true,
        },
      });
    }
  };

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
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={userData.user}
          addLikeCallback={handleLike}
          removeCallback={handleRemove}
        />
      ))}
    </div>
  );
};

export default BlogList;