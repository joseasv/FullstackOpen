import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  timeoutId: undefined,
  isAlert: false,
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    firstNotification(state, action) {
      console.log(state);
      return state;
    },
    showNotification(state, action) {
      console.log("showNotification state ", state);
      console.log("showNotification action", action);
      if (state.timeoutId !== undefined) {
        clearTimeout(state.timeoutId);
      }
      state = {
        message: action.payload.message,
        timeoutId: action.payload.timeoutId,
        isAlert: action.payload.isAlert,
      };
      return state;
    },
    removeNotification(state, action) {
      console.log("removeNotification state ", state);
      console.log("clearing notification");
      state = initialState;
      return state;
    },
  },
});

export const { firstNotification, showNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (message, timeoutSeconds, isAlert) => {
  return (dispatch) => {
    const timeoutId = setTimeout(
      () => dispatch(removeNotification()),
      timeoutSeconds * 1000,
    );
    dispatch(showNotification({ message, timeoutId, isAlert }));
  };
};

export default notificationSlice.reducer;