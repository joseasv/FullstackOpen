import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);

  //console.log("notification", notification);

  if (notification.message !== "") {
    if (notification.isAlert === true) {
      return <div className="alert">{notification.message}</div>;
    } else {
      return <div className="notification">{notification.message}</div>;
    }
  }
};

export default Notification;