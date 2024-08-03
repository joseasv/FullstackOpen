import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog, user, removeCallback, isLast }) => {
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
    <div className="visibleBlogData">
      <Link className="link" to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
      {!isLast ? <div className="divider py-0"></div> : null}

      <div style={showWhenVisible} className="notVisibleBlogData">
        <div className="link link-primary">{blog.url} </div>

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