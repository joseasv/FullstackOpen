import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import AddBlogForm from "./components/AddBlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Toggable";
import { useContext } from "react";
import NotificationContext from "./NotificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./index.css";

const App = () => {
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(JSON.parse(JSON.stringify(result)));

  let blogs = [];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [notification, notificationDispatch] = useContext(NotificationContext);

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
      notificationDispatch({
        type: "setMessage",
        payload: {
          message: `Succesfully logged in.`,
          seconds: 5,
          isAlert: false,
        },
      });
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      //setErrorMessage("Wrong credentials");

      notificationDispatch({
        type: "setMessage",
        payload: {
          message: `Wrong username or password`,
          seconds: 5,
          isAlert: true,
        },
      });
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedbloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog);
      notificationDispatch({
        type: "setMessage",
        payload: {
          message: `removed ${blog.title} by ${blog.author} was removed`,
          seconds: 5,
          isAlert: false,
        },
      });
      setBlogs(blogs.filter((fBlog) => fBlog.id !== blog.id));
    }
  };

  const addLike = async (blogData) => {
    blogData.likes++;
    const returnedBlog = await blogService.likeBlog(blogData);
    /*setBlogs(
      blogs.map((blog) => {
        if (blog.id === returnedBlog.id) {
          returnedBlog.user = blogData.user;
          return returnedBlog;
        }

        return blog;
      }),
    );*/
  };

  if (result.isLoading) {
    console.log("Query isLoading");
    return <div>loading data...</div>;
  }

  if (result.isError) {
    console.log("Query isError");
    return <div>errors on the MongoDB backend</div>;
  }

  if (result.isSuccess) {
    console.log("Query isSuccess");
    blogs = result.data;
  }

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

  //const blogs = [];

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
        <AddBlogForm togglableRef={blogFormRef} />
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