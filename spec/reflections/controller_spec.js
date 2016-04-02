const createServer = require('../../app/server').createServer;
const server = createServer();

describe("GET /reflections", function() {
  beforeEach(function() {
    this.request = {
      method: 'GET',
      url: '/reflections'
    };
  });

  it("shows reflections", function(done) {
    server.inject(this.request, function(response) {
      expect(response.statusCode).toEqual(200);
      expect(response.result).toEqual("reflections index");
      done();
    })
  });
});

describe("GET /reflections/{id}", function() {
  beforeEach(function() {
    this.request = {
      method: 'GET',
      url: '/reflections/1'
    };
  });

  it("shows reflections", function(done) {
    server.inject(this.request, function(response) {
      expect(response.statusCode).toEqual(200);
      expect(response.result).toEqual("reflections show 1");
      done();
    })
  });
});
