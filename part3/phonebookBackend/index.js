require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
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

app.get("/", (response) => {
  response.send("dist/index.html");
});

app.get("/api/persons", (response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (response) => {
  Person.find({}).then((persons) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${Date()}</p>`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
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

        person
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => next(error));
      } else {
        return response.status(400).json({
          error: "name must be unique",
        });
      }
    });
  }
});

const unknownEndpoint = (response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
