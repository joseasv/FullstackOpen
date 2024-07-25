import { useState, useEffect, useRef } from "react";
import AddBlogForm from "./components/AddBlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Toggable";
import { setNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { useDispatch } from "react-redux";
import BlogList from "./components/BlogList";
import "./index.css";
import {
  loginUser,
  checkLoggedUserJSON,
  logoutUser,
} from "./reducers/userReducer";
import { useSelector } from "react-redux";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  let user = useSelector(({ user }) => user);
  console.log("user ", user);

  const handleLogin = async (event) => {
    event.preventDefault();

    const onSuccess = () => {
      setUsername("");
      setPassword("");
      dispatch(setNotification(`Succesfully logged in.`, 5, false));
    };

    const onFailure = (exception) => {
      dispatch(setNotification(exception.response.data.error, 5, true));
    };

    dispatch(loginUser(username, password, onSuccess, onFailure));
  };

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(checkLoggedUserJSON());
  }, []);

  const blogFormRef = useRef();

  const toggleCallback = () => {
    blogFormRef.current.toggleVisibility();
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
            console.log("App logout button pressed");
            dispatch(logoutUser());
          }}
        >
          logout{" "}
        </button>
      </p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <AddBlogForm toggleCallback={toggleCallback} />
      </Togglable>
      <BlogList />
    </div>
  );
};

export default App;