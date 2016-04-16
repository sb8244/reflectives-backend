const createServer = require('app/server').createServer;
const server = createServer();
const db = require('app/models/index');
const authHelper = require('../helpers/auth');

function setupReflections(callback) {
  this.reflections = [];

  db.reflectionCollection.create({
    reflections: [
      { name: 'Test', html: '', secondsOfWriting: 1 },
      { name: 'Test 2', html: '<p>Hi!</p>', secondsOfWriting: 2 }
    ]
  }, {
    include: [ db.reflection ]
  }).then((reflectionCollection) => {
    this.reflections = reflectionCollection.get('reflections');
    callback();
  });
}

describe('GET /reflections', function() {
  beforeEach(function(done) {
    this.request = {
      method: 'GET',
      url: '/reflections',
      headers: {
        Authorization: `Bearer ${authHelper.getToken()}`
      }
    };

    setupReflections.bind(this)(done);
  });

  it('shows reflections', function(done) {
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.result.length).toEqual(1);
      expect(response.result[0].reflections.length).toEqual(2);
      expect(response.result[0].reflections[0].id).toEqual(this.reflections[0].id);
      expect(response.result[0].reflections[0].name).toEqual('Test');
      done();
    });
  });

  it('requires headers', function(done) {
    delete this.request.headers;
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(401);
      done();
    });
  });

  it('requires fresh headers', function(done) {
    this.request.headers.Authorization = `Bearer ${authHelper.getExpiredToken()}`
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(401);
      done();
    });
  });
});

describe('GET /reflections/{id}', function() {
  beforeEach(function(done) {
    this.request = {
      method: 'GET',
      url: '/reflections/',
      headers: {
        Authorization: `Bearer ${authHelper.getToken()}`
      }
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

  it('requires headers', function(done) {
    this.request.url = this.request.url + this.reflections[0].id;
    delete this.request.headers;
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(401);
      done();
    });
  });
});

describe('POST reflections', function() {
  beforeEach(function() {
    this.request = {
      method: 'POST',
      url: '/reflections',
      headers: {
        Authorization: `Bearer ${authHelper.getToken()}`
      },
      payload: {
        reflections: [
          {
            name: "A",
            html: "<div>A</div>",
            secondsOfWriting: 1
          },
          {
            name: "B",
            html: "<div>B</div>",
            secondsOfWriting: 2
          }
        ]
      }
    };
  });

  it("responds with the created collection", function(done) {
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(200);
      expect(response.result.reflections.length).toEqual(2);
      done();
    });
  });

  it("creates a new reflectionCollection with multiple reflections", function(done) {
    server.inject(this.request, (response) => {

      db.reflectionCollection.count().then((count) => {
        expect(count).toEqual(1);

        db.reflectionCollection.findOne().then((collection) => {
          collection.getReflections().then((reflections) => {
            expect(reflections.length).toEqual(2);
            done();
          });
        });
      });
    });
  });
});
