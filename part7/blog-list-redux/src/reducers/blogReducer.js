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
        likes: 0,
      };

      state.push(newBlogInfo);
    },
    addLikeTo(state, action) {
      console.log("addLikeTo action ", action);
      const id = action.payload;
      const blogToChange = state.find((b) => b.id === id);
      const votedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1,
      };

      return state.map((blog) => {
        blog.id !== id ? blog : votedBlog;
      });
    },
    setBlogs(state, action) {
      return action.payload;
    },
    replaceBlog(state, action) {
      return state.map((blog) => {
        return blog.id !== action.payload.id ? blog : action.payload;
      });
    },
    removeBlog(state, action) {
      return state.filter((blog) => {
        return blog.id !== action.payload.id;
      });
    },
  },
});

export const { addBlog, setBlogs, addLikeTo, replaceBlog, removeBlog } =
  blogSlice.actions;

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

export const addLike = (blog) => {
  return async (dispatch) => {
    console.log("addLike to blog ", blog);
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    console.log("likedBlog ", likedBlog);
    const changedBlog = await blogService.likeBlog(likedBlog);
    console.log("changedBlog ", changedBlog);
    dispatch(replaceBlog(changedBlog));
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blog);
    dispatch(removeBlog(blog));
  };
};

export default blogSlice.reducer;