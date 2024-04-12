require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("dist"));

morgan.token("data", function getData(req) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(":method :url :response-time :data"));

const Person = require("./models/person");

app.get("/", (request, response) => {
  response.send("dist/index.html");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${Date()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(request.body);
  if (!body.name) {
    return response.status(400).json({
      error: "name must be set",
    });
  } else {
    Person.find({ name: body.name }).then((result) => {
      console.log("Person find by name, result", result);
      if (result.length === 0) {
        if (!body.number) {
          return response.status(400).json({
            error: "number must be set",
          });
        }

        const person = new Person({
          name: body.name,
          number: body.number,
        });

        person.save().then((savedPerson) => {
          response.json(savedPerson);
        });
      } else {
        return response.status(400).json({
          error: "name must be unique",
        });
      }
    });
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
