import { useState, useEffect, useRef } from "react";
import AddBlogForm from "./components/AddBlogForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Toggable";
import { useContext } from "react";
import NotificationContext from "./NotificationContext";
import UserContext from "./UserContext";
import { useQuery } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import HomeRoute from "./components/HomeRoute";
import UsersRoute from "./components/UsersRoute";

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

  const [notification, notificationDispatch] = useContext(NotificationContext);
  const [userData, userDispatch] = useContext(UserContext);

  console.log("user from UserContext ", userData);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      userDispatch({
        type: "LOGIN_USER",
        payload: {
          user,
        },
      });
      notificationDispatch({
        type: "setMessage",
        payload: {
          message: `Succesfully logged in.`,
          seconds: 5,
          isAlert: false,
        },
      });
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
    userDispatch({ type: "LOGIN_USER_FROM_LOCAL_STORAGE" });
  }, []);

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

  if (userData.user === null) {
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

  const padding = {
    padding: 5,
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
      </div>

      <div>
        <h2>blogs</h2>
        <Notification />
        <p>
          {userData.user.name} logged-in{" "}
          <button
            onClick={() => {
              userDispatch({ type: "LOGOUT_USER" });
            }}
          >
            logout{" "}
          </button>
        </p>

        <Routes>
          <Route path="/users" element={<UsersRoute />} />
          <Route path="/" element={<HomeRoute blogs={blogs} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;