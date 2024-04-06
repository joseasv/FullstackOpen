import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const search = (query) => {
  const request = axios.get(`${baseUrl}/name/${query}`);
  return request.then((response) => response.data);
};

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => response.data);
};

export default { getAll, search };
