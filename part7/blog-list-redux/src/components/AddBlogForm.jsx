import { setNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { useState } from "react";

const AddBlogForm = ({ user, toggleCallback }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");

  const dispatch = useDispatch();

  const addBlog = async (event) => {
    event.preventDefault();

    dispatch(
      createBlog({
        title: newTitle,
        author: newAuthor,
        url: newURL,
        user: user,
      }),
    );

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