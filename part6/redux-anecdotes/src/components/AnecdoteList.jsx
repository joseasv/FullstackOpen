import { useSelector, useDispatch } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    const sortFunc = (a, b) => b.votes - a.votes;
    console.log("filter", filter);
    console.log("anecdotes", anecdotes);

    if (filter.length === 0) {
      return [...anecdotes].sort(sortFunc);
    } else {
      return [...anecdotes]
        .filter(({ content }) =>
          content.toLowerCase().includes(filter.toLowerCase()),
        )
        .sort(sortFunc);
    }
  });

  const vote = (anecdote) => {
    dispatch(setNotification(`you voted for '${anecdote.content}'`, 5));

    console.log("vote", anecdote.id);
    dispatch(addVote(anecdote));
  };

  console.log("anecdotes", anecdotes);

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;