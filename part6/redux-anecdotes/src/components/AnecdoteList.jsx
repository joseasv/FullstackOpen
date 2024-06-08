import { useSelector, useDispatch } from "react-redux";
import { addVoteOf } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    const sortFunc = (a, b) => b.votes - a.votes;
    console.log("filter", filter);
    console.log("anecdotes", anecdotes);

    if (filter.length === 0) {
      return anecdotes.sort(sortFunc);
    } else {
      return anecdotes
        .filter(({ content }) =>
          content.toLowerCase().includes(filter.toLowerCase()),
        )
        .sort(sortFunc);
    }
  });

  const vote = (id) => {
    console.log("vote", id);
    dispatch(addVoteOf(id));
  };

  console.log("anecdotes", anecdotes);

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;