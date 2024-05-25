import blogService from "../services/blogs";
import { useState, useEffect } from "react";

const Blog = ({ blog, user, removeCallback }) => {
  const [visible, setVisible] = useState(false);
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    setBlogData(blog);
  });

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: visible ? "" : "none" };

  const addLike = async () => {
    blogData.likes++;
    const returnedBlog = await blogService.likeBlog(blogData);
    setBlogData(returnedBlog);
  };

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
          likes {blog.likes} <button onClick={addLike}>like</button>
        </div>
        <div>{blog.user && blog.user.name}</div>
        {blog.user.username === user.username && (
          <button onClick={() => removeCallback(blog)}>remove</button>
        )}
      </div>
    </div>
  );
};

export default Blog;