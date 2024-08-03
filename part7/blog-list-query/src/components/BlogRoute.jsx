import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";

const BlogRoute = ({ blog }) => {
  /*const Button = styled.button`
    background: Bisque;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid Chocolate;
    border-radius: 3px;
  `;

  const Input = styled.input`
    margin: 0.25em;
  `;*/

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

  const commentMutation = useMutation({
    mutationFn: blogService.commentBlog,
    onSuccess: (commentedBlog) => {
      console.log("commentMutation commentedBlog ", commentedBlog);
      const blogs = queryClient.getQueryData(["blogs"]);
      console.log("commentMutation blogs ", blogs);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => {
          console.log(blog);
          return blog.id === commentedBlog.id ? commentedBlog : blog;
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

  const handleCommentAdd = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    console.log("handleCommentAdd comment ", comment);

    commentMutation.mutate({
      blog: blog,
      comment: comment,
    });

    notificationDispatch({
      type: "setMessage",
      payload: {
        message: `added comment to blog ${blog.title}`,
        seconds: 5,
        isAlert: false,
      },
    });

    event.target.comment.value = "";
  };

  console.log("BlogRoute blog ", blog);
  console.log("BlogRoute blog comments ", blog.comments);

  return (
    <div className="prose">
      <h2>{blog.title}</h2>
      <a className="link link-primary" href={blog.url}>
        {blog.url}
      </a>
      <div>
        <span>
          {blog.likes} likes{" "}
          <button onClick={() => handleLike(blog)}>like</button>
        </span>
      </div>
      <div>added by {blog.user.name}</div>
      <h3>comments</h3>
      <form onSubmit={handleCommentAdd}>
        <input name="comment" /> <button type="submit">add comment</button>
      </form>
      <ul className="menu bg-base-200 rounded-box w-56">
        {blog.comments.map((comment) => {
          return <li key={comment.id}>{comment.text}</li>;
        })}
      </ul>
    </div>
  );
};

export default BlogRoute;