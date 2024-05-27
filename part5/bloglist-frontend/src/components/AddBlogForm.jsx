import PropTypes from "prop-types";
import { useState } from "react";

const AddBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newURL,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewURL("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:{" "}
        <input
          placeholder="titleInput"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </div>
      <div>
        author:{" "}
        <input
          placeholder="authorInput"
          value={newAuthor}
          onChange={(event) => setNewAuthor(event.target.value)}
        />
      </div>
      <div>
        url:{" "}
        <input
          placeholder="urlInput"
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

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default AddBlogForm;