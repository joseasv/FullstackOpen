const Filter = ({ onSubmitHandler, onChangeHandler, filter }) => {
  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        filter shown with <input value={filter} onChange={onChangeHandler} />
      </div>
    </form>
  );
};

export default Filter;