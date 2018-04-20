'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('get all items', function() {

  it('should return the default of 10 Notes', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
      });
  });

  it('should return an array of objects with the id, title and content', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });

  it('should return correct search results for a valid query', () => {
    return chai.request(app)
      .get('/api/notes?searchTerm=ways')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(3);
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });

  it('should return an empty array for an incorrect query', () => {
    return chai.request(app)
      .get('/api/notes?searchTerm=doesntexistasfaf')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});

describe('get item by id', () => {

  it('should return correct note object with id, title and content for a given id', () => {
    return chai.request(app)
      .get('/api/notes/1005')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.title).to.equal('10 ways cats can help you live to 100');
        expect(res.body.id).to.equal(1005);
      });
  });

  it('should respond with a 404 for an invalid id', () => {
    return chai.request(app)
      .get('/api/notes/9999')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('create new item', () => {

  it('should create and return a new item with location header when provided valid data', () => {
    const newNote = {title: 'my title', content: 'my content' };
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(res => {
        expect(res).to.have.status(201);
        expect(newNote.title).to.equal(res.body.title);
        expect(newNote.content).to.equal(res.body.content);
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
      });
  });

  it('should return an error when missing "title" field', () => {
    const newNote = {'going': 'to fail'};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('updating item in list', () => {

  it('should update and return a note object when given valid data', () => {
    const updated = {title: 'test update', content: 'test test test'};
    return chai.request(app)
      .put('/api/notes/1003')
      .send(updated)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1003);
        expect(res.body.title).to.equal(updated.title);
        expect(res.body.content).to.equal(updated.content);
      });
  });

  it('should respond with a 404 for an invalid id', () => {
    const updated = {title: 'test update', content: 'test test test'};
    return chai.request(app)
      .put('/api/notes/aintHereYo')
      .send(updated)
      .catch(err => err.response)
      .then(function (res) {
        expect(res).to.have.status(404);
      });
  });

  it('should return an error when missing "title" field', function () {
    const updateItem = {'content': 'ur missing the title'};
    return chai.request(app)
      .put('/api/notes/1007')
      .send(updateItem)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('delete item from list', () => {
  it('should delete an item by id', () => {
    return chai.request(app)
      .delete('/api/notes/1005')
      .then(res => {
        expect(res).to.have.status(204);
      });
  });
});
//this is a comment