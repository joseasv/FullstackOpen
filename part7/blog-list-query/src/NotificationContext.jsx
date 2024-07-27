import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  console.log("state", state);
  console.log("action", action);

  if (state.timeoutId !== undefined) {
    clearTimeout(state.timeoutId);
  }

  switch (action.type) {
    case "setMessage": {
      return {
        message: action.payload.message,
        isAlert: action.payload.isAlert,
        seconds: action.payload.seconds,
      };
    }
    case "clearMessage": {
      return {
        message: "",
      };
    }
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: "",
    isAlert: false,
    seconds: 0,
  });

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationState = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export default NotificationContext;