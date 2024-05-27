import PropTypes from "prop-types";
import { useState } from "react";

const Blog = ({ blog, user, removeCallback, addLikeCallback }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: visible ? "block" : "none" };

  //   console.log(blog);

  return (
    <div style={blogStyle} className="visibleBlogData">
      {blog.title} {blog.author}
      <button
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {visible ? "hide" : "view"}
      </button>
      <div style={showWhenVisible} className="notVisibleBlogData">
        <div>{blog.url} </div>
        <div>
          likes {blog.likes}{" "}
          <button onClick={() => addLikeCallback(blog)}>like</button>
        </div>
        <div>{blog.user && blog.user.name}</div>
        {blog.user.username === user.username && (
          <button onClick={() => removeCallback(blog)}>remove</button>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  removeCallback: PropTypes.func.isRequired,
};

export default Blog;