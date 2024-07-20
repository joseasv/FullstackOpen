import { useSelector, useDispatch } from "react-redux";
import Blog from "./Blog";
import { setNotification } from "../reducers/notificationReducer";

const BlogList = ({ user }) => {
  const dispatch = useDispatch();

  const blogs = useSelector(({ blogs }) => {
    console.log("BlogList");
    console.log(blogs);
    return blogs;
  });

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          removeCallback={() => {}}
          addLikeCallback={() => {}}
        />
      ))}
    </div>
  );
};

export default BlogList;