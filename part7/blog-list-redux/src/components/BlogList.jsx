import { useSelector, useDispatch } from "react-redux";
import Blog from "./Blog";
import { setNotification } from "../reducers/notificationReducer";
import { addLike } from "../reducers/blogReducer";
import { deleteBlog } from "../reducers/blogReducer";

const BlogList = ({ user }) => {
  const dispatch = useDispatch();

  const blogs = useSelector(({ blogs }) => {
    console.log("BlogList");
    console.log(blogs);
    return blogs;
  });

  const like = (blog) => {
    dispatch(setNotification(`liked blog ${blog.title}`, 5, false));

    dispatch(addLike(blog));
  };

  const remove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      console.log("BlogList remove blog", blog);
      dispatch(deleteBlog(blog));
      dispatch(setNotification(`Removed blog ${blog.title} `, 5, true));
    }
  };

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          removeCallback={remove}
          addLikeCallback={like}
        />
      ))}
    </div>
  );
};

export default BlogList;