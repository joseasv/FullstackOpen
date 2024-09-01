import axios from "axios";
import { Entry } from "../types";
import { NewEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllEntries = () => {
  return axios.get<Entry[]>(baseUrl).then((response) => response.data);
};

export const createEntry = (object: NewEntry) => {
  console.log(object);
  return axios.post<Entry>(baseUrl, object).then((response) => response.data);
};
