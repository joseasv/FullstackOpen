import { setNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState } from "react";

const AddBlogForm = ({ toggleCallback }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");

  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);

  const addBlog = async (event) => {
    event.preventDefault();

    console.log("trying to add a blog");

    const onSuccess = () => {
      dispatch(
        setNotification(
          `a new blog ${newTitle} by ${newAuthor} was added`,
          5,
          false,
        ),
      );

      setNewTitle("");
      setNewAuthor("");
      setNewURL("");

      toggleCallback();
    };

    const onFailure = (exception) => {
      console.log(exception);
      dispatch(setNotification(exception.response.data.error, 5, true));
    };

    dispatch(
      createBlog(
        {
          title: newTitle,
          author: newAuthor,
          url: newURL,
          user: user,
        },
        onSuccess,
        onFailure,
      ),
    );
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:{" "}
        <input
          data-testid="title"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </div>
      <div>
        author:{" "}
        <input
          data-testid="author"
          value={newAuthor}
          onChange={(event) => setNewAuthor(event.target.value)}
        />
      </div>
      <div>
        url:{" "}
        <input
          data-testid="url"
          value={newURL}
          onChange={(event) => setNewURL(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  );
};

export default AddBlogForm;