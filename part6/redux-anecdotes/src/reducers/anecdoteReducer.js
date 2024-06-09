import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addVoteOf(state, action) {
      console.log("addVoteOf action", action);
      const id = action.payload;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      return state.map((anecdote) =>
        anecdote.id !== id ? anecdote : changedAnecdote,
      );
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
    replaceAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id !== action.payload.id ? anecdote : action.payload,
      );
    },
  },
});

export const { addVoteOf, appendAnecdote, setAnecdotes, replaceAnecdote } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const addVote = (anecdote) => {
  return async (dispatch) => {
    const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const changedAnecdote = await anecdoteService.addVote(votedAnecdote);
    dispatch(replaceAnecdote(changedAnecdote));
  };
};

export default anecdoteSlice.reducer;