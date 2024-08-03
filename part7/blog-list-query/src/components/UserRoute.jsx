const UserRoute = ({ user }) => {
  console.log("showing userRoute ", user);

  if (user === null) {
    return null;
  } else {
    return (
      <div>
        <h1>{user.name}</h1>
        <h2>added blogs</h2>
        <ul className="menu bg-base-200 rounded-box w-56">
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  }
};

export default UserRoute;