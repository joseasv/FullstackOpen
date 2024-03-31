import { useState } from 'react'

const Person = ({name}) => {
  return (
    <div>
      {name}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log("clicked form button", event.target)

    const newPerson = {
      name: newName
    }

    const personFound = persons.find(person => person.name === newName)
    console.log('personFound', personFound)
    if (personFound !== undefined) {
      alert(`${newName} is already added to phonebook`)
    } else {
        setPersons(persons.concat(newPerson))
        setNewName('')
    }
  }

  const handleNameChange = (event) => {
    console.log("handleNameChange", event.target.value)

    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <div>debug: {newName}</div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>

        {persons.map( person => <Person name={person.name} key={person.name} />)}

    </div>
  )
}

export default App