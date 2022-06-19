const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();

const data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

morgan.token("log", (req, res) => {
  if (req.method == "POST") {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});

app.use(cors());
app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :log")
);

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info of ${data.length} people</p>
    <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.find((person) => person.id === id);
  if (person) {
    return res.json(person);
  }
  return res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const newPerson = data.find((person) => person.id === id);
  const newPersons = data.filter((person) => person.id !== id);
  console.log(newPersons);
  return res.status(202).json(newPerson);
});

app.post("/api/persons", (req, res) => {
  const person = req.body;
  if (!person.name || !person.number) {
    return res.json({ error: "no name or number specified" });
  }
  if (data.some((man) => man.name === person.name)) {
    return res.json({ error: "name already exists in the phonebook" });
  }
  const newPerson = { id: Math.floor(Math.random() * 100), ...person };

  newPersons = data.concat(newPerson);
  return res.json(newPersons);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
