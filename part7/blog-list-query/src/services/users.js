import axios from "axios";
const baseUrl = "/api/users";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  //console.log("setting token to", token);
};

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data;
};

export default { getAll };