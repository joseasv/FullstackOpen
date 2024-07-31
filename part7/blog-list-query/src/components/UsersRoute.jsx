import { useQuery } from "@tanstack/react-query";
import usersService from "../services/users";
import UserTable from "./UserTable";

const UsersRoute = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    retry: false,
    refetchOnWindowFocus: false,
  });

  console.log(JSON.parse(JSON.stringify(result)));

  let users = [];

  if (result.isLoading) {
    console.log("Query isLoading");
    return <div>loading data...</div>;
  }

  if (result.isError) {
    console.log("Query isError");
    return <div>errors on the MongoDB backend</div>;
  }

  if (result.isSuccess) {
    console.log("Query isSuccess");
    users = result.data;
  }

  return (
    <div>
      <h2>Users</h2>
      <UserTable users={users} />
    </div>
  );
};

export default UsersRoute;