const Person = ({ name, number }) => {
  return (
    <div>
      {name} {number}
    </div>
  );
};

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person name={person.name} number={person.number} key={person.id} />
      ))}
    </div>
  );
};

export default Persons;