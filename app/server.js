'use strict';

const Hapi = require('hapi');
const passwordless = require('passwordless');
const passwordlessPlugin = require('passwordless-hapi');
const MemoryStore = require('passwordless-memorystore');

passwordless.init(new MemoryStore());
passwordless.addDelivery(require('./email/passwordless'));

function createServer() {
  const server = new Hapi.Server();
  const port = process.env.PORT || 8000;

  server.connection({
    host: 'localhost',
    port: port
  });

  // JWT Auth
  server.register(require('hapi-auth-jwt'), function (error) {
    function validate(request, decodedToken, callback) {
      var error, credentials = { uid: decodedToken.uid };

      if (!credentials) {
        return callback(error, false, credentials);
      }

      return callback(error, true, credentials)
    }

    server.auth.strategy('token', 'jwt', {
      key: process.env.JWT_AUTH_SECRET,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    });
  });

  // Passwordless Auth
  server.register({
    register: passwordlessPlugin,
    options: {
      passwordless: passwordless,
      sendTokenPath: "/auth",
      onSuccessfulAuth: function(reply, uid, request) {
        request.passwordless = { uid: uid };
        reply.continue();
      },
      getUserId: function(user, delivery, callback, req) {
        callback(null, user);
      },
      sendTokenSuccessHandler: function(request, reply) {
        reply({ status: "success" });
      }
    }
  });

  // Routes
  server.route(require('./reflections/routes'));
  server.route(require('./auth/routes'));

  return server;
}

module.exports = {
  createServer: createServer,
  passwordless: passwordless
};
