const PersonForm = ({ onSubmitHandler, newData, onChangeHandlers }) => {
  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        name:{" "}
        <input value={newData.name} onChange={onChangeHandlers.nameHandler} />
      </div>
      <div>
        number:{" "}
        <input
          value={newData.number}
          onChange={onChangeHandlers.numberHandler}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;