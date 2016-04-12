'use strict';

const serverModule = require('app/server');
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
        url: '/auth?token=token&uid=1'
      };

      passwordless._tokenStore.storeOrUpdate("token", "1", 60 * 60 * 1000, undefined, done);
    });

    it("contains a valid auth token", function() {
      server.inject(this.request, (response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.result.token).toBeDefined();
        expect(response.result.expiresAt).toBeDefined();
        let payload = jwt.verify(response.result.token, 'test');
        expect(payload.uid).toEqual('1');
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
