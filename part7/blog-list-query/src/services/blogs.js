import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  //console.log("setting token to", token);
};

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data.sort((a, b) => b.likes - a.likes);
};

const create = async (newObject) => {
  //console.log("token", token);
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const deleteBlog = async (blog) => {
  console.log("token", token);
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config);
  return response.data;
};

const likeBlog = async (blog) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config);
  return response.data;
};

const commentBlog = async (blogAndComment) => {
  const { blog, comment } = blogAndComment;
  console.log("blog service commentBlog comment ", comment);
  console.log("blog service commentBlog blog ", blog);
  const config = { headers: { Authorization: token } };
  const response = await axios.put(
    `${baseUrl}/${blog.id}/comments`,
    { comment },
    config,
  );
  return response.data;
};

export default { getAll, create, setToken, likeBlog, deleteBlog, commentBlog };