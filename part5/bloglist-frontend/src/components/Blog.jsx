import { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: visible ? "" : "none" };

  //console.log(blog);

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {visible ? "hide" : "view"}
      </button>
      <div style={showWhenVisible}>
        <div>{blog.url} </div>
        <div>
          likes {blog.likes} <button>like</button>
        </div>
        <div>{blog.user && blog.user.name}</div>
      </div>
    </div>
  );
};

export default Blog;