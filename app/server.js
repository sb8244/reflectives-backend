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

  // Routes
  server.route(require('./reflections/routes'));
  server.route(require('./auth/routes'));

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

  return server;
}

module.exports = {
  createServer: createServer,
  passwordless: passwordless
};
