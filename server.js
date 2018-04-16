'use strict';

const express = require('express');

const data = require('./db/notes');

const app = express();
app.use(express.static('public'));

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
app.get('/api/notes', (req, res) => {
  const query = req.query.searchTerm;
  const filtered = data.filter(item => {
    return item.title.includes(query) ||
    item.content.includes(query) || !query;
  });
  res.json(filtered);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const filtered = data.find(item => item.id === Number(id));
  res.json(filtered);
});