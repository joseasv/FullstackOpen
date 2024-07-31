import { useState, useEffect, useRef } from "react";

import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import usersService from "./services/users";
import { useContext } from "react";
import NotificationContext from "./NotificationContext";
import UserContext from "./UserContext";
import { useQuery } from "@tanstack/react-query";
import { useMatch, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import HomeRoute from "./components/HomeRoute";
import UsersRoute from "./components/UsersRoute";
import UserRoute from "./components/UserRoute";
import BlogRoute from "./components/BlogRoute";

const App = () => {
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(JSON.parse(JSON.stringify(result)));

  let blogs = [];

  const usersResult = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(JSON.parse(JSON.stringify(usersResult)));

  let users = [];

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

  const match = useMatch("/users/:id");
  let user = undefined;

  const blogMatch = useMatch("/blogs/:id");
  let blog = undefined;

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

    blog = blogMatch
      ? blogs.find((blog) => blog.id === blogMatch.params.id)
      : null;
  }

  if (usersResult.isLoading) {
    console.log("Query isLoading");
    return <div>loading data...</div>;
  }

  if (usersResult.isError) {
    console.log("Query isError");
    return <div>errors on the MongoDB backend</div>;
  }

  if (usersResult.isSuccess) {
    console.log("Query isSuccess");
    users = usersResult.data;

    user = match
      ? users.find((user) => {
          console.log("checking user", user);
          return user.id === match.params.id;
        })
      : null;

    console.log("isSuccess users", users);
    console.log("match ", match);
    console.log("matched user ", user);
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

  const padding = {
    padding: 5,
  };

  return (
    <div>
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
          <Route path="/users" element={<UsersRoute users={users} />} />
          <Route path="/" element={<HomeRoute blogs={blogs} />} />
          <Route path="/users/:id" element={<UserRoute user={user} />} />
          <Route path="/blogs/:id" element={<BlogRoute blog={blog} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;