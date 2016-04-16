'use strict';

const serverModule = require('app/server');
const db = require('app/models');
const createServer = serverModule.createServer;
const passwordless = serverModule.passwordless;
const server = createServer();
const jwt = require('jsonwebtoken');

describe("POST /auth", function() {
  beforeEach(function() {
    this.request = {
      method: 'POST',
      url: '/auth',
      payload: {
        user: 'test@test.com'
      }
    };

    spyOn(passwordless._defaultDelivery, 'sendToken').and.callFake((tokenToSend, uidToSend, recipient, callback) => {
      this.deliveryArgs = { tokenToSend, uidToSend, recipient, callback };
      callback();
    });
    passwordless._defaultDelivery.sendToken.calls.reset();
  });

  it('is successful', function(done) {
    server.inject(this.request, function(response) {
      expect(response.statusCode).toEqual(200);
      expect(response.result).toEqual({ status: "success" })
      done();
    });
  });
});

describe("GET /auth?token&uid", function() {
  describe("with a valid token", function() {
    beforeEach(function(done) {
      this.request = {
        method: 'GET',
        url: '/auth?token=token&uid=test@test.com'
      };

      passwordless._tokenStore.storeOrUpdate("token", "test@test.com", 60 * 60 * 1000, undefined, done);
    });

    it('creates a user with the email', function(done) {
      server.inject(this.request, (response) => {
        db.user.findOne({ email: 'test@test.com' }).then((user) => {
          expect(user).not.toEqual(null);
          expect(user.get('email')).toEqual('test@test.com');
          done();
        });
      });
    });

    it("contains a valid auth token", function(done) {
      server.inject(this.request, (response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.result.token).toBeDefined();

        db.user.findOne({ email: 'test@test.com' }).then((user) => {
          let payload = jwt.verify(response.result.token, 'test');
          expect(payload.uid).toEqual(jasmine.any(Number));
          expect(payload.uid).toEqual(user.get('id'));
          done();
        });
      });
    });

    it('uses an old user with the email', function(done) {
      db.user.create({ email: 'test@test.com' }).then((existingUser) => {
        server.inject(this.request, (response) => {
          let payload = jwt.verify(response.result.token, 'test');
          expect(payload.uid).toEqual(existingUser.get('id'));
          done();
        });
      });
    });
  });

  describe("without a valid token", function() {
    beforeEach(function() {
      this.request = {
        method: 'GET',
        url: '/auth'
      };
    });

    it("is unauthorized", function() {
      server.inject(this.request, (response) => {
        expect(response.statusCode).toEqual(401);
      });
    });
  });
});
