import { useNavigate } from "react-router-dom";

import { useField } from "../hooks";
import { useRef } from "react";

const CreateNew = (props) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("adding", content.value, author.value, info.value);
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });

    navigate("/");
  };

  const contentRef = useRef();
  const authorRef = useRef();
  const infoRef = useRef();

  const content = useField("text", contentRef);
  const author = useField("text", authorRef);
  const info = useField("text", infoRef);

  const handleReset = (e) => {
    e.preventDefault();
    console.log("contentRef", contentRef);
    contentRef.current.reset();
    authorRef.current.reset();
    infoRef.current.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button> <button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

export default CreateNew;