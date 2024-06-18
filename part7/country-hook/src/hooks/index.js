import axios from "axios";

import { useState, useEffect } from "react";

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

export const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    async function fetchCountry() {
      if (name) {
        let response = {};
        try {
          response = await axios.get(
            `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`,
          );
          response.found = true;
        } catch (error) {
          console.log(error);
          response.found = false;
        }

        console.log(response);

        setCountry(response);
      }
    }

    fetchCountry();
  }, [name]);

  return country;
};