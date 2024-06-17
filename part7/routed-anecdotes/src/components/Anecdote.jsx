import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id;
  const anecdote = anecdotes.find((a) => a.id === Number(id));
  //console.log("showing anecdote", anecdote);
  return (
    <div>
      <h2>
        {anecdote.content} by {anecdote.author}
      </h2>
      <p>has {anecdote.votes} votes</p>
      <p>
        for more info see <Link to={anecdote.info}>{anecdote.info}</Link>
      </p>
    </div>
  );
};

export default Anecdote;