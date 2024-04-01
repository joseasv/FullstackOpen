import { useState, useEffect } from "react";
import axios from "axios";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [backupPersons, setBackupPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    console.log("clicked form button", event.target);

    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    const personFound = persons.find((person) => person.name === newName);
    console.log("personFound", personFound);
    if (personFound !== undefined) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPerson));
      setBackupPersons(persons);
      setNewName("");
      setNewNumber("");
    }
  };

  const applyFilter = (event) => {
    event.preventDefault();
    console.log("filtering list");

    if (newFilter === "") {
      setPersons(backupPersons);
    } else {
      const filteredPersonsList = persons.filter((person) =>
        person.name.toLowerCase().includes(newFilter),
      );

      setBackupPersons(persons);
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
