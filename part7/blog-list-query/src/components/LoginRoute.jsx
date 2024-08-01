import Notification from "./Notification";

const LoginRoute = ({ handleLogin }) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleLogin(event.target.username.value, event.target.password.value);
        }}
      >
        <div>
          username
          <input type="text" name="username" data-testid="username" />
        </div>
        <div>
          password
          <input type="password" name="password" data-testid="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginRoute;