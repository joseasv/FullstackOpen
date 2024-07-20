import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    addBlog(state, action) {
      console.log("reducer addBlog state", state, "action", action);

      const newBlogInfo = {
        title: action.payload.title,
        author: action.payload.author,
        url: action.payload.url,
        user: action.payload.user,
        id: action.payload.id,
      };

      state.push(newBlogInfo);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { addBlog, setBlogs } = blogSlice.actions;

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlogObject = blogObject;
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