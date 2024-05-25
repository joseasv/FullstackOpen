import PropTypes from "prop-types";

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

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  isAlert: PropTypes.bool.isRequired,
};

export default Notification;