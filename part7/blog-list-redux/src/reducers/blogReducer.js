import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { addBlog } = blogSlice.actions;

export const createBlog = (title, author, url) => {
  return (dispatch) => {
    dispatch(addBlog({ title, author, url }));
  };
};

export default blogSlice.reducer;