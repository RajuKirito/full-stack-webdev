import { useEffect, useState } from "react";
import axios from "axios";
import Service from "./Backend.js";

const AddedMessage = ({ name }) => {
  return (
    <div className="added">
      <p>{name} has been added to the DB</p>
    </div>
  );
};

const UpdatedMessage = ({ name }) => {
  return (
    <div className="added">
      <p>{name}'s phone number has been updated to the DB</p>
    </div>
  );
};

const DeletedMessage = ({ name }) => {
  return (
    <div className="deleted">
      <p>{name} has been deleted from the db</p>
    </div>
  );
};

const Filter = ({ filterText, handleFilter }) => {
  return (
    <p>
      Filter shown with{" "}
      <input value={filterText} onChange={handleFilter}></input>
    </p>
  );
};

const PersonForm = ({
  handleSubmit,
  newName,
  setNewName,
  newPhone,
  setNewPhone,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newPhone}
          onChange={(event) => setNewPhone(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filterText, list, persons, handleDelete }) => {
  return (
    <div>
      {!filterText
        ? persons.map((person) => (
            <p key={person.id}>
              {person.name} {person.number}{" "}
              <button onClick={() => handleDelete(person)}>delete</button>
            </p>
          ))
        : list.map((person) => (
            <p key={person.id}>
              {person.name} {person.number}{" "}
              <button onClick={() => handleDelete(person)}>delete</button>
            </p>
          ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filterText, setFilterText] = useState("");
  const [numberAdded, setNumberAdded] = useState("");
  const [numberUpdated, setNumberUpdated] = useState("");
  const [deleted, setDeleted] = useState("");

  const [list, setList] = useState(persons);

  useEffect(() => {
    Service.getAll().then((response) => {
      return setPersons(response);
    });
  }, []);

  const handleFilter = (event) => {
    setFilterText(event.target.value);
    setList(
      persons.filter((person) =>
        person.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(`Do you want to change the phone number of ${newName}?`)
      ) {
        let id = persons.find((person) => person.name === newName);
        Service.update({
          name: newName,
          number: newPhone,
          id: id.id,
        }).then((response) => {
          if (response.name) {
            setPersons(
              persons.map((person) =>
                person.name !== newName ? person : response
              )
            );
            setNumberUpdated(newName);
            setTimeout(() => {
              setNumberUpdated(null);
            }, 5000);
          } else {
            setDeleted(response.error.response.data.error);
            setTimeout(() => {
              setDeleted("");
            }, 3000);
          }
        });

        setFilterText("");
        setNewName("");
        setNewPhone("");
      }
    } else {
      const person = {
        name: newName,
        number: newPhone,
      };
      const addin = Service.add(person);
      addin
        .then((response) => {
          if (response.name) {
            setPersons([...persons, response]);
            setNumberAdded(newName);
            setTimeout(() => {
              setNumberAdded(null);
            }, 5000);
          } else {
            setDeleted(response.error.response.data.error);
            setTimeout(() => {
              setDeleted("");
            }, 3000);
          }
        })
        .catch((err) => console.log(err));

      setFilterText("");
      setNewName("");
      setNewPhone("");
    }
  };

  const handleDelete = (person) => {
    Service.remove(person).then((response) => {
      console.log(response);
      return setPersons(
        persons.filter((man) => {
          if (man.id !== person.id) {
            return true;
          } else {
            setDeleted(person.name);
            setTimeout(() => {
              setDeleted("");
            }, 3000);
            return false;
          }
        })
      );
    });
  };

  return (
    <div>
      <h1>Phonebook</h1>
      {numberAdded ? <AddedMessage name={numberAdded} /> : <></>}
      {numberUpdated ? <UpdatedMessage name={numberUpdated} /> : <></>}
      {deleted ? <DeletedMessage name={deleted} /> : <></>}
      <Filter filterText={filterText} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newPhone={newPhone}
        setNewPhone={setNewPhone}
      />
      <h2>Numbers</h2>
      <Persons
        filterText={filterText}
        list={list}
        persons={persons}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
