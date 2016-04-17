'use strict';

const createServer = require('app/server').createServer;
const server = createServer();
const db = require('app/models/index');
const authHelper = require('../helpers/auth');

function* setupReflections() {
  let reflectionCollection = yield db.reflectionCollection.create({
    reflections: [
      { name: 'Test', html: '', secondsOfWriting: 1 },
      { name: 'Test 2', html: '<p>Hi!</p>', secondsOfWriting: 2 }
    ]
  }, {
    include: [ db.reflection ]
  });

  return reflectionCollection.get('reflections');
}

describe('GET /reflections', function() {
  beforeEach(function*() {
    this.request = {
      method: 'GET',
      url: '/reflections',
      headers: {
        Authorization: `Bearer ${authHelper.getToken()}`
      }
    };

    this.reflections = yield setupReflections();
  });

  it('shows reflections', function*() {
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    expect(response.statusCode).toEqual(200);
    expect(response.result.length).toEqual(1);
    expect(response.result[0].reflections.length).toEqual(2);
    expect(response.result[0].reflections[0].id).toEqual(this.reflections[0].id);
    expect(response.result[0].reflections[0].name).toEqual('Test');
  });

  it('requires headers', function*() {
    delete this.request.headers;
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    expect(response.statusCode).toEqual(401);
  });

  it('requires fresh headers', function*() {
    this.request.headers.Authorization = `Bearer ${authHelper.getExpiredToken()}`;
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    expect(response.statusCode).toEqual(401);
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

  it("responds with the created collection", function*() {
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    expect(response.statusCode).toEqual(200);
    expect(response.result.reflections.length).toEqual(2);
  });

  it("creates a new reflectionCollection with multiple reflections", function*() {
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    let count = yield db.reflectionCollection.count();
    expect(count).toEqual(1);

    let collection = yield db.reflectionCollection.findOne();
    let reflections = yield collection.getReflections();
    expect(reflections.length).toEqual(2);
  });

  it("cleanly handles errors in the reflections", function*() {
    delete this.request.payload.reflections[1].name;
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    let count = yield db.reflection.count();
    expect(count).toEqual(0);
    expect(response.statusCode).toEqual(422);
  });
});
