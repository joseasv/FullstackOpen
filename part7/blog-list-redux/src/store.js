import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";

const store = configureStore({
  reducer: {
    /*anecdotes: anecdoteReducer,
    filter: filterReducer,*/
    blogs: blogReducer,
    notification: notificationReducer,
  },
});

console.log(store.getState());

export default store;