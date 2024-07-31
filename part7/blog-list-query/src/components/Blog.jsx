import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog, user, removeCallback }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: visible ? "block" : "none" };

  console.log(user.username, blog.user.username);

  return (
    <div style={blogStyle} className="visibleBlogData">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>

      <div style={showWhenVisible} className="notVisibleBlogData">
        <div>{blog.url} </div>

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