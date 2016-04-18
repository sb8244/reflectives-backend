'use strict';

const createServer = require('app/server').createServer;
const server = createServer();
const db = require('app/models/index');
const authHelper = require('../helpers/auth');

function* setupReflections(user) {
  let otherUser = yield db.user.create({ email: "notme@test.com" });
  let otherCollection = yield db.reflectionCollection.create({
    reflections: [
      { name: 'Not Mine', html: '', secondsOfWriting: 1 },
    ]
  }, {
    include: [ db.reflection ]
  });
  yield otherCollection.addUser(otherUser);

  let reflectionCollection = yield user.createReflectionCollection();

  return [
    yield reflectionCollection.createReflection({ name: 'Test', html: '<div></div>', secondsOfWriting: 1, order: 1 }),
    yield reflectionCollection.createReflection({ name: 'Test 2', html: '<p>Hi1</p>', secondsOfWriting: 2, order: 0 })
  ];
}

describe('GET /reflections', function() {
  beforeEach(function*() {
    let otherUser = yield db.user.create({ email: "notme2@test.com" });
    this.user = yield db.user.create({ email: 'test@test.com' });
    this.reflections = yield setupReflections(this.user);

    this.request = {
      method: 'GET',
      url: '/reflections',
      headers: {
        Authorization: `Bearer ${yield authHelper.getToken(this.user)}`
      }
    };
  });

  it('shows the user reflections sorted by order ASC', function*() {
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    expect(response.statusCode).toEqual(200);
    expect(response.result.length).toEqual(1);
    expect(response.result[0].reflections.length).toEqual(2);
    expect(response.result[0].reflections[0].id).toEqual(this.reflections[1].id);
    expect(response.result[0].reflections[0].name).toEqual('Test 2');
  });

  it('requires headers', function*() {
    delete this.request.headers;
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    expect(response.statusCode).toEqual(401);
  });

  it('requires fresh headers', function*() {
    this.request.headers.Authorization = `Bearer ${yield authHelper.getExpiredToken()}`;
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    expect(response.statusCode).toEqual(401);
  });
});

describe('POST reflections', function() {
  beforeEach(function*() {
    this.user = yield db.models.user.create({ email: 'test@test.com' });
    this.request = {
      method: 'POST',
      url: '/reflections',
      headers: {
        Authorization: `Bearer ${yield authHelper.getToken(this.user)}`
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

  it('creates the collection off of auth User', function*() {
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    let userCollections = yield this.user.getReflectionCollections();
    expect(response.statusCode).toEqual(200);
    expect(userCollections.length).toEqual(1);
  });

  it("creates a new reflectionCollection with multiple reflections", function*() {
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    let count = yield db.reflectionCollection.count();
    expect(count).toEqual(1);

    let collection = yield db.reflectionCollection.findOne();
    let reflections = yield collection.getReflections();
    expect(reflections.length).toEqual(2);
    expect(reflections[0].order).toEqual(0);
    expect(reflections[1].order).toEqual(1);
  });

  it("cleanly handles errors in the reflections", function*() {
    delete this.request.payload.reflections[1].name;
    let response = yield new Promise((resolve) => server.inject(this.request, resolve));
    let count = yield db.reflection.count();
    expect(count).toEqual(0);
    expect(response.statusCode).toEqual(422);
  });
});
