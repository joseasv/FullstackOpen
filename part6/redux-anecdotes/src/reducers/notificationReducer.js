import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "message in the redux store",
  timeoutId: undefined,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    firstNotification(state, action) {
      return state;
    },
    showNotification(state, action) {
      console.log("showNotification state ", state);
      if (state.timeoutId !== undefined) {
        clearTimeout(state.timeoutId);
      }
      state = {
        message: action.payload.message,
        timeoutId: action.payload.timeoutId,
      };
      return state;
    },
    removeNotification(state, action) {
      console.log("removeNotification state ", state);
      console.log("clearing notification");
      state = { message: "", timeoutId: undefined };
      return state;
    },
  },
});

export const { firstNotification, showNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;