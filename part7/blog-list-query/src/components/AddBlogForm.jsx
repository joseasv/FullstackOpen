import blogService from "../services/blogs";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddBlogForm = ({ togglableRef }) => {
  const queryClient = useQueryClient();
  const [notification, notificationDispatch] = useContext(NotificationContext);

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      console.log("newBlogMutation onSuccess blog ", newBlog);
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));

      notificationDispatch({
        type: "setMessage",
        payload: {
          message: `blog ${newBlog.title} of ${newBlog.author} added`,
          seconds: 5,
          isAlert: false,
        },
      });

      togglableRef.current.toggleVisibility();
    },
    onError: (error) => {
      console.log("newBlogMutation onError error ", error.response.data.error);
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

  const addBlog = (event) => {
    event.preventDefault();

    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;

    newBlogMutation.mutate({ title, author, url });

    event.target.title.value = "";
    event.target.author.value = "";
    event.target.url.value = "";
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title: <input data-testid="title" name="title" />
      </div>
      <div>
        author: <input data-testid="author" name="author" />
      </div>
      <div>
        url: <input data-testid="url" name="url" />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  );
};

export default AddBlogForm;