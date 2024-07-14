import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";


const store = configureStore({
  reducer: {
    /*anecdotes: anecdoteReducer,
    filter: filterReducer,*/
    notification: notificationReducer,
  },
});

console.log(store.getState());

export default store;