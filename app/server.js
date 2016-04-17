'use strict';

const Hapi = require('hapi');
const passwordless = require('passwordless');
const passwordlessPlugin = require('passwordless-hapi');
const MemoryStore = require('passwordless-memorystore');
const db = require('app/models');

passwordless.init(new MemoryStore());
passwordless.addDelivery(require('./email/passwordless'));

function createServer() {
  const server = new Hapi.Server();
  const port = process.env.PORT || 8000;

  server.connection({
    host: 'localhost',
    port: port,
    routes: {
      cors: true
    }
  });

  // JWT Auth
  server.register(require('hapi-auth-jwt'), function (error) {
    function validate(request, decodedToken, callback) {
      var error, credentials = { uid: decodedToken.uid };

      db.user.findOne({ email: decodedToken.uid }).then((user) => {
        if (!user) {
          return callback(error, false, credentials);
        }

        return callback(error, true, user)
      });
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
      onSuccessfulAuth: function(reply, emailAddress, request) {
        db.user.findOrCreate({ where: { email: emailAddress }}).spread((user) => {
          request.passwordless = { uid: user.get('id') };
          reply.continue();
        });
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
