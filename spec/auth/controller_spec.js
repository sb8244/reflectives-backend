const serverModule = require('app/server');
const createServer = serverModule.createServer;
const passwordless = serverModule.passwordless;
const server = createServer();

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
