const createServer = require('../../app/server').createServer;
const server = createServer();
const db = require('../../app/models/index');

function setupReflections(callback) {
  this.reflections = [];
  Promise.all([
    db.Reflection.create({ name: 'Test', html: '', secondsOfWriting: 1 }).then(model => this.reflections.push(model)),
    db.Reflection.create({ name: 'Test 2', html: '<p>Hi!</p>', secondsOfWriting: 2 }).then(model => this.reflections.push(model))
  ]).then(callback);
}

describe('GET /reflections', function() {
  beforeEach(function(done) {
    this.request = {
      method: 'GET',
      url: '/reflections'
    };

    setupReflections.bind(this)(done);
  });

  it('shows reflections', function(done) {
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.result.length).toEqual(2);
      expect(response.result[0].id).toEqual(this.reflections[0].id);
      expect(response.result[0].name).toEqual('Test');
      done();
    });
  });
});

describe('GET /reflections/{id}', function() {
  beforeEach(function(done) {
    this.request = {
      method: 'GET',
      url: '/reflections/'
    };

    setupReflections.bind(this)(done);
  });

  it('shows reflections', function(done) {
    this.request.url = this.request.url + this.reflections[0].id;
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.result.id).toEqual(this.reflections[0].id);
      expect(response.result.name).toEqual(this.reflections[0].name);
      done();
    });
  });

  describe('with an invalid id', function() {
    it('is a 404', function(done) {
      this.request.url = this.request.url + 0;
      server.inject(this.request, (response) => {
        expect(response.result.error).toEqual('Not Found');
        expect(response.statusCode).toEqual(404);
        done();
      });
    });
  });
});
