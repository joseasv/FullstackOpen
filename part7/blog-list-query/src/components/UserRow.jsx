import { Link } from "react-router-dom";

const UserRow = ({ user }) => {
  return (
    <tr className="bg-base-200">
      <td>
        <Link className="link link-primary" to={`/users/${user.id}`}>
          {user.name}{" "}
        </Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  );
};

export default UserRow;