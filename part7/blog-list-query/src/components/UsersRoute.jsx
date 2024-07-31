import UserTable from "./UserTable";

const UsersRoute = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <UserTable users={users} />
    </div>
  );
};

export default UsersRoute;