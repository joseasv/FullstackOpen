import UserRow from "./UserRow";

const UserTable = ({ users }) => {
  return (
    <div>
      <table className="table-md">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow user={user} key={user.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;