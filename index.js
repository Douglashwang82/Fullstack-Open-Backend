require('dotenv').config();                 // .env
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const morgan = require('morgan');            // logs
const cors = require('cors');                // handle error cross side..
const Persons = require('./models/persons'); // mongodb


app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(function (tokens, req, res) {
  const temp = req.method === 'POST' ||  req.method === 'PUT' ? JSON.stringify(req.body) : '';
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    temp,
  ].join(' ')
}));

app.get('/api/persons', (request, response) => {
  Persons.find({}).then(persons => {
    response.json(persons)
  }).catch(err => console.log(err.message));
})

app.get('/api/persons/:id', (request, response, next) => {
  Persons.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
  
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  const person = new Persons({
    name: request.body.name,
    number: request.body.number,
  });
  
  person.save().then(result => {
    response.json(result);
  }).catch(err => next(err));
})




app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`<p>Phonebook has infor for ${phonebook.length} people</p>
    <p>${Date().toString()}</p>
    `);
})


app.delete('/api/persons/:id', (request, response) => {
  // mongodb handle the deleteing deleted element error.
  Persons.findByIdAndRemove(request.params.id)
  .then(result => response.status(204).end())
  .catch(err => next(err));
})


app.put('/api/persons/:id', (request, response,next) => {
  const newPerson = {
    name: request.body.name,
    number: request.body.number,
  }
  Persons.findByIdAndUpdate(request.params.id, newPerson)
    .then(updatePerson => {
      response.json(newPerson);
    })
    .catch(err => next(err));
})


// this middleware at the bottom because it handle all unkonwn routes.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//must be last loaded middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error);
}

app.use(errorHandler);

app.listen(PORT);

console.log('Server is running on ' + PORT);
