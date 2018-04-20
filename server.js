'use strict';

const express = require('express');
const morgan = require('morgan');

// const data = require('./db/notes');
// const simDB = require('./db/simDB');
// const notes = simDB.initialize(data);
const notesRouter = require('./router/notes.router')

const {PORT} = require('./config');

// const {logger} = require('./middleware/logger');

const app = express();
app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());

console.log('Hello Noteful!');

app.use('/api', notesRouter);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;