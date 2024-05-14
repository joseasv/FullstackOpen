import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import AddBlogForm from "./components/AddBlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");
  const [newMessageData, setMessageData] = useState({
    message: null,
    isAlert: false,
  });

  const showTempNotification = (message, isAlert) => {
    setMessageData({ message, isAlert });
    setTimeout(() => {
      setMessageData({
        message: null,
        isAlert: false,
      });
    }, 4000);
  };

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
      showTempNotification(`Succesfully logged in.`, false);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      //setErrorMessage("Wrong credentials");
      showTempNotification(`Wrong username or password`, true);
      setTimeout(() => {
        //setErrorMessage(null);
      }, 5000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedbloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (event) => {
    event.preventDefault();

    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
    };

    try {
      const returnedBlog = await blogService.create(newBlog);
      //console.log(returnedBlog, " was added");
      showTempNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} was added`,
        false,
      );
      setBlogs(blogs.concat(returnedBlog));
      setNewTitle("");
      setNewAuthor("");
      setNewURL("");
    } catch (exception) {
      console.log(exception.response.data);
      showTempNotification(exception.response.data.error, true);
    }
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleURLChange = (event) => {
    setNewURL(event.target.value);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification
          message={newMessageData.message}
          isAlert={newMessageData.isAlert}
        />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
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
      <Notification
        message={newMessageData.message}
        isAlert={newMessageData.isAlert}
      />
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

      <h2>create new</h2>
      <AddBlogForm
        onSubmitHandler={addBlog}
        newData={{ title: newTitle, author: newAuthor, url: newURL }}
        onChangeHandlers={{
          titleHandler: handleTitleChange,
          authorHandler: handleAuthorChange,
          urlHandler: handleURLChange,
        }}
      />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;