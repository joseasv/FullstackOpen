import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  console.log("state", state);
  console.log("action", action);
  if (state.timeoutId !== undefined) {
    clearTimeout(state.timeoutId);
  }

  state = { message: action.message, timeoutId: action.timeoutId };

  return state;
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: "Prueba",
    timeoutId: undefined,
  });

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;