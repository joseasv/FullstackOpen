const Notification = ({ message, isAlert }) => {
  if (message === null) {
    return null;
  }

  if (isAlert === true) {
    return <div className="alert">{message}</div>;
  } else {
    return <div className="notification">{message}</div>;
  }
};

export default Notification;