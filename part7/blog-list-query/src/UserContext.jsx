import { createContext, useContext, useReducer } from "react";
import blogService from "./services/blogs";

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_USER": {
      const user = action.payload.user;

      blogService.setToken(user.token);

      window.localStorage.setItem(
        "loggedbloglistappUser",
        JSON.stringify(user),
      );
      return { user };
    }

    case "LOGIN_USER_FROM_LOCAL_STORAGE": {
      const loggedUserJSON = window.localStorage.getItem(
        "loggedbloglistappUser",
      );
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        blogService.setToken(user.token);
        return { user };
      } else {
        return {
          user: null,
        };
      }
    }

    case "LOGOUT_USER": {
      window.localStorage.clear();
      blogService.setToken(null);
      return { user: null };
    }
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, {
    user: null,
  });

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserState = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[0];
};

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext);
  return userAndDispatch[1];
};

export default UserContext;
