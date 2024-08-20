import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Recommend from "./components/Recommend";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  const navigate = useNavigate();

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      console.log(addedBook);
      notify(`${addedBook.title} added`);
      //updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  const padding = {
    padding: 5,
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();

    navigate("/");
  };

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <Link style={padding} to="/">
          authors
        </Link>
        <Link style={padding} to="/books">
          books
        </Link>

        {token ? (
          <span>
            <Link style={padding} to="/add">
              add
            </Link>
            <Link style={padding} to="/recommend">
              recommend
            </Link>
            <Link
              style={padding}
              onClick={(event) => {
                logout();
              }}
            >
              logout
            </Link>
          </span>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>

      <Routes>
        <Route
          path="/add"
          element={
            token ? (
              <NewBook setError={notify} />
            ) : (
              <Navigate replace to={"/"} />
            )
          }
        />
        <Route
          path="/recommend"
          element={token ? <Recommend /> : <Navigate replace to={"/"} />}
        />
        <Route path="/books" element={<Books />} />
        <Route path="/" element={<Authors setError={notify} token={token} />} />
        <Route
          path="/login"
          element={<LoginForm setToken={setToken} setError={notify} />}
        />
      </Routes>
    </div>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export default App;
