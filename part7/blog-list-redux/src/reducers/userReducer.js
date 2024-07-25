import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { exact } from "prop-types";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser(state, action) {
      console.log("userReducer state ", state, " action ", action);
      return action.payload;
    },
    removeUser(state, action) {
      state = null;
      return null;
    },
    getUser(state, action) {
      return state;
    },
  },
});

export const { addUser, removeUser, getUser } = userSlice.actions;

export const loginUser = (username, password, onSuccess, onFailure) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem(
        "loggedbloglistappUser",
        JSON.stringify(user),
      );
      dispatch(addUser(user));
    } catch (exception) {
      onFailure(exception);
    }
  };
};

export const checkLoggedUserJSON = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedbloglistappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch(addUser(user));
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    console.log("userReducer logoutUser");
    window.localStorage.clear();
    blogService.setToken(null);
    dispatch(removeUser());
  };
};

export default userSlice.reducer;