import AddBlogForm from "./AddBlogForm";
import Togglable from "./Toggable";
import BlogList from "./BlogList";
import { useRef } from "react";

const HomeRoute = ({ blogs }) => {
  const blogFormRef = useRef();

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <AddBlogForm togglableRef={blogFormRef} />
      </Togglable>
      <BlogList blogs={blogs} />
    </div>
  );
};

export default HomeRoute;