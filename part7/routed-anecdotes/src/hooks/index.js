import { useImperativeHandle, useState } from "react";

export const useField = (props, refs) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => setValue("");

  useImperativeHandle(refs, () => {
    return { reset };
  });

  return {
    props,
    value,
    onChange,
  };
};