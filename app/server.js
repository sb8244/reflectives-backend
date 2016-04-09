'use strict';

const Hapi = require('hapi');
const passwordless = require('passwordless');
const passwordlessPlugin = require('passwordless-hapi');
const MemoryStore = require('passwordless-memorystore');

passwordless.init(new MemoryStore());
passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback) {
  console.log("delivery!", arguments);
  callback();
});

function createServer() {
  const server = new Hapi.Server();
  const port = process.env.PORT || 8000;

  server.connection({
    host: 'localhost',
    port: port
  });

  // Routes
  const reflections = require('./reflections/routes');
  server.route(reflections);

  // Configure Cookies
  server.state('data', {
      ttl: null,
      isSecure: true,
      isHttpOnly: true,
      encoding: 'base64json',
      clearInvalid: false, // remove invalid cookies
      strictHeader: true // don't allow violations of RFC 6265
  });

  server.register({
    register: passwordlessPlugin,
    options: {
      passwordless: passwordless,
      onSuccessfulAuth: function(userId) {
        console.log("Auth success!", userId);
      },
      getUserId: function(user, delivery, callback, req) {
        callback(null, user);
      },
      sendTokenSuccessHandler: function(request, reply) {
        reply('ok!');
      }
    }
  });

  return server;
}

module.exports = {
  createServer: createServer
};
