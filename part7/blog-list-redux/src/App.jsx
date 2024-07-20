import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import AddBlogForm from "./components/AddBlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Toggable";
import { setNotification } from "./reducers/notificationReducer";
import { createBlog } from "./reducers/blogReducer";
import { useDispatch } from "react-redux";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedbloglistappUser",
        JSON.stringify(user),
      );

      blogService.setToken(user.token);
      //console.log(user);
      dispatch(setNotification(`Succesfully logged in.`, 5, false));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      //setErrorMessage("Wrong credentials");
      dispatch(setNotification(`Wrong username or password`, 5, true));
      setTimeout(() => {
        //setErrorMessage(null);
      }, 5000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      //console.log("blogs App.jsx useEffect ", ...blogs);
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedbloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    try {
      const returnedBlog = await blogService.create(blogObject);
      //console.log(returnedBlog, " was added");

      dispatch(
        setNotification(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} was added`,
          5,
          false,
        ),
      );
      returnedBlog.user = user;
      setBlogs(blogs.concat(returnedBlog));
    } catch (exception) {
      console.log(exception.response.data);
      dispatch(setNotification(exception.response.data.error, 5, true));
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog);
      setBlogs(blogs.filter((fBlog) => fBlog.id !== blog.id));
      dispatch(setNotification(`Removed blog ${blog.title} `, 5, false));
    }
  };

  const addLike = async (blogData) => {
    blogData.likes++;
    const returnedBlog = await blogService.likeBlog(blogData);
    setBlogs(
      blogs.map((blog) => {
        if (blog.id === returnedBlog.id) {
          returnedBlog.user = blogData.user;
          return returnedBlog;
        }

        return blog;
      }),
    );
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              data-testid="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              data-testid="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged-in{" "}
        <button
          onClick={() => {
            window.localStorage.clear();
            setUser(null);
            blogService.setToken(null);
          }}
        >
          logout{" "}
        </button>
      </p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <AddBlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          addLikeCallback={addLike}
          removeCallback={removeBlog}
        />
      ))}
    </div>
  );
};

export default App;