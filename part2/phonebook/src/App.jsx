import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personService from "./services/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("effect initialPersons");

    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    console.log("clicked form button", event.target);

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const personFound = persons.find((person) => person.name === newName);
    console.log("personFound", personFound);
    if (personFound !== undefined) {
      alert(`${newName} is already added to phonebook`);
    } else {
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const applyFilter = (event) => {
    event.preventDefault();
    console.log("filtering list");

    if (newFilter === "") {
      personService.getAll().then((initialPersons) => {
        setPersons(initialPersons);
      });
    } else {
      const filteredPersonsList = persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter),
      );

      console.log("filteredPersonsList", filteredPersonsList);

      setPersons(filteredPersonsList);
      setNewFilter("");
    }
  };

  const handleNameChange = (event) => {
    console.log("handleNameChange", event.target.value);

    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log("handleNameChange", event.target.value);

    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    console.log("handleFilterChange", event.target.value);

    setNewFilter(event.target.value.toLowerCase());
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        onSubmitHandler={applyFilter}
        onChangeHandler={handleFilterChange}
        filter={newFilter}
      />
      <h3>add a new person</h3>
      <PersonForm
        onSubmitHandler={addPerson}
        newData={{ name: newName, number: newNumber }}
        onChangeHandlers={{
          nameHandler: handleNameChange,
          numberHandler: handleNumberChange,
        }}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} />
    </div>
  );
};

export default App;
