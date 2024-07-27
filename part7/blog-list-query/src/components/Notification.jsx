import { useContext } from "react";
import NotificationContext from "../NotificationContext";

let timeoutId = undefined;

const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext);

  if (notification.message !== "") {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      notificationDispatch({ type: "clearMessage" });
    }, notification.seconds * 1000);

    if (notification.isAlert === true) {
      return <div className="alert">{notification.message}</div>;
    } else {
      return <div className="notification">{notification.message}</div>;
    }
  }
};

export default Notification;