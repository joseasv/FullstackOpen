const AddBlogForm = ({ onSubmitHandler, newData, onChangeHandlers }) => {
  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        title:{" "}
        <input value={newData.title} onChange={onChangeHandlers.titleHandler} />
      </div>
      <div>
        author:{" "}
        <input
          value={newData.author}
          onChange={onChangeHandlers.authorHandler}
        />
      </div>
      <div>
        url:{" "}
        <input value={newData.url} onChange={onChangeHandlers.urlHandler} />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  );
};

export default AddBlogForm;