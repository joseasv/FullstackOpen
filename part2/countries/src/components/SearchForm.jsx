const SearchForm = ({ onSubmitHandler, onChangeHandler, filter }) => {
  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        find countries <input value={filter} onChange={onChangeHandler} />
      </div>
    </form>
  );
};

export default SearchForm;