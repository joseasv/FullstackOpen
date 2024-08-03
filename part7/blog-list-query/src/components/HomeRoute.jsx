import AddBlogForm from "./AddBlogForm";
import Togglable from "./Toggable";
import BlogList from "./BlogList";
import { useRef } from "react";

const HomeRoute = ({ blogs }) => {
  const blogFormRef = useRef();

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2 className="text-2xl font-bold">Create new blog entry</h2>
        <AddBlogForm togglableRef={blogFormRef} />
      </Togglable>
      <BlogList blogs={blogs} />
    </div>
  );
};

export default HomeRoute;