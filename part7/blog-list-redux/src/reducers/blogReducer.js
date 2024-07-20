import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const initialState = [];

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    addBlog(state, action) {
      console.log("reducer addBlog state", state, "action", action);

      const newBlogInfo = {
        title: action.payload.title,
        author: action.payload.author,
        url: action.payload.url,
      };

      state.push(newBlogInfo);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { addBlog } = blogSlice.actions;

export const createBlog = (title, author, url) => {
  return async (dispatch) => {
    const newBlogObject = { title, author, url };
    const newBlog = await blogService.create(newBlogObject);
    dispatch(addBlog(newBlog));
  };
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export default blogSlice.reducer;