import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import Notification from "./Notification";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const [notification, notificationDispatch] = useContext(NotificationContext);

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
    onError: () => {
      const timeoutId = setTimeout(
        () => notificationDispatch("", undefined),
        5000,
      );
      notificationDispatch({
        message: `too short anecdote, must have length 5 or more`,
        timeoutId,
      });
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    newAnecdoteMutation.mutate({ content, votes: 0 });
    const timeoutId = setTimeout(
      () => notificationDispatch("", undefined),
      5000,
    );
    notificationDispatch({ message: `anecdote ${content} created`, timeoutId });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
