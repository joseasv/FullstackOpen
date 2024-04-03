import personService from "../services/Persons";

const Person = ({ name, number, deleteHandler, id }) => {
  return (
    <div>
      {name} {number} <button onClick={deleteHandler}>delete</button>
    </div>
  );
};

const Persons = ({ persons }) => {
  const handleDeleteClick = (name, id) => {
    console.log("deleting", name, "with id", id);

    /*if (window.confirm("Delete", name, "?")) {
      personService.deletePerson(id);
    }*/
  };

  return (
    <div>
      {persons.map((person) => (
        <Person
          name={person.name}
          number={person.number}
          key={person.id}
          id={person.id}
          deleteHandler={() => {
            console.log("deleting", person.name, "with id", person.id);

            if (window.confirm(`Delete ${person.name} ?`)) {
              personService
                .deletePerson(person.id)
                .then(() => {
                  window.confirm(
                    `The person ${person.name} was deleted succesfully`,
                  );
                })
                .catch((error) => {
                  window.confirm(
                    `Warning: The person ${person.name} doesn't exist in the database or was already deleted`,
                  );
                });
            }
          }}
        />
      ))}
    </div>
  );
};

export default Persons;