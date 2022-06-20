require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  //console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

morgan.token("log", (req, res) => {
  console.log(req.method);
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});

app.use(express.static("build"));

app.use(cors());
app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :log")
);

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((result) => res.send(`${result.length}`))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(202).end())
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  console.log(req.body);
  const person = new Person(req.body);
  if (!person.name || !person.number) {
    return res.json({ error: "no name or number specified" });
  }
  person
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  console.log(person);
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((response) => res.json(response))
    .catch((err) => next(err));
});

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
