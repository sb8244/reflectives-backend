require('app-module-path').addPath(__dirname);
const createServer = require('app/server').createServer;
const server = createServer();

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
