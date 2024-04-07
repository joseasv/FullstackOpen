const Person = ({ name, number, deleteHandler }) => {
  return (
    <div>
      {name} {number} <button onClick={deleteHandler}>delete</button>
    </div>
  );
};

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          name={person.name}
          number={person.number}
          key={person.id}
          deleteHandler={() => deletePerson(person.name, person.id)}
        />
      ))}
    </div>
  );
};

export default Persons;