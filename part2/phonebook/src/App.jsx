import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personService from "./services/Persons";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [newMessageData, setMessageData] = useState({
    message: null,
    isAlert: false,
  });

  const showTempNotification = (message, isAlert) => {
    setMessageData({ message, isAlert });
    setTimeout(() => {
      setMessageData({
        message: null,
        isAlert: false,
      });
    }, 4000);
  };

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
      if (
        confirm(
          `${newName} is already added to phonebook. Replace the old number with this new one?`,
        )
      ) {
        const changedPerson = { ...personFound, number: newNumber };
        console.log("updated person, changedPerson");
        personService
          .update(changedPerson)
          .then((response) => {
            showTempNotification(`${newName}'s phone was updated`, false);
            console.log("Persons service update response", response);

            const newPersons = persons.map((p) =>
              p.id !== personFound.id ? p : response,
            );
            console.log("newPersons", newPersons);
            setPersons(newPersons);
          })
          .catch((error) => {
            showTempNotification(
              `The person ${newName} was already deleted from server.`,
              true,
            );
            setPersons(persons.filter((p) => p.id !== personFound.id));
          });
      }
    } else {
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          showTempNotification(`${newName} was added`, false);
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.log("personService.create catch error", error);
          const message = error.response.data.split("\n")[7].split("<br>")[0];
          showTempNotification(message.substring(5, message.length), true);
        });
    }
  };

  const deletePerson = (name, id) => {
    console.log("deleting", name, "with id", id);

    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          showTempNotification(
            `The person ${name} was deleted succesfully`,
            false,
          );
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          showTempNotification(
            `Warning: The person ${name} doesn't exist in the database or was already deleted`,
            true,
          );
          setPersons(persons.filter((p) => p.id !== id));
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
    //console.log("handleNameChange", event.target.value);

    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    //console.log("handleNameChange", event.target.value);

    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    //console.log("handleFilterChange", event.target.value);

    setNewFilter(event.target.value.toLowerCase());
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={newMessageData.message}
        isAlert={newMessageData.isAlert}
      />
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
      <Persons persons={persons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
