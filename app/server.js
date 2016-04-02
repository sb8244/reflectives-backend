'use strict';

const Hapi = require('hapi');


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

  return server;
}

module.exports = {
  createServer: createServer
};
