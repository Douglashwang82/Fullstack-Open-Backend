let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001
const morgan = require('morgan');
const cors = require('cors');
app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(function (tokens, req, res) {
    const temp = req.method === 'POST' ? JSON.stringify(req.body) : '';
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      temp,
    ].join(' ')
  }));

app.get('/api/persons',(request, response) =>
{
    response.json(phonebook);
})


app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has infor for ${phonebook.length} people</p>
    <p>${Date().toString()}</p>
    `);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const target = phonebook.find(e => e.id === id);
    if (target) {
        response.json(target);
    } else {
        response.status(400).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter(e => e.id !== id);
    response.status(204).end();
    console.log('deleted an object');
})

app.post('/api/persons', (request, response) => {

    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    if (phonebook.find(e => e.name === request.body.name)) {
        return response.status(400).json({
            error: 'name taken'
        })
    }

    const newId = Math.floor(Math.random() * 10000);
    const newObject = {
        "id": newId,
        "name": request.body.name,
        "number": request.body.number
    }
    phonebook = phonebook.concat(newObject);
    return response.status(204).json({message: "success added"});
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  let found = phonebook.find(e => e.id === id);
  const newObject = {
    name: request.body.name,
    number: request.body.number,
    id: id
  }
  found = newObject;

  response.status(204).end();
  console.log('deleted an object');

})


// this middleware at the bottom because it handle all unkonwn routes.
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)


app.listen(PORT);

console.log('Server is running on ' + PORT);
