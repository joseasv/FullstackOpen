import { useState, useEffect } from "react";
import axios from "axios";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  let token = null;

  const setToken = (newToken) => {
    token = `bearer ${newToken}`;
  };

  const create = async (resource) => {
    const config = {
      headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, resource, config);
    setResources(resources.concat(response.data));
  };

  const getAll = async () => {
    const response = await axios.get(baseUrl);
    setResources(response.data);
  };

  const update = async (id, resource) => {
    const response = await axios.put(`${baseUrl}/${id}`, resource);
    setResources(
      response.map((r) => (r.id === response.data.id ? response.data : r)),
    );
  };

  const service = {
    create,
    getAll,
    update,
    setToken,
  };

  return [resources, service];
};