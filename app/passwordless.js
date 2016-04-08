/*
 * Implement Passwordless over top of Hapi
 *  Not intended to bring all features of passwordless into Hapi, just the core
 *  Must work with the store interface that passwordless defines
 *  Must work with the emailing interface that passwordless defines
 *
 * Initial Functionality
 *  POST /sendtoken - requests a token from passwordless
 *  GET ?pwdless - accepts pwdless token from an email and logs in the user. Works with any url
 *  GET, DELETE /logout - ends the current session
 *  restricted middleware plugin - lock down routes based on something
 */

'use strict';

const passwordless = require('passwordless');
const MemoryStore = require('passwordless-memorystore');

passwordless.init(new MemoryStore());
passwordless.addDelivery((tokenToSend, uidToSend, recipient, callback) => {
  callback();
});

function setupHapi(server) {
  server.route({
    method: 'POST',
    path: '/sendtoken',
    handler: function(request, reply) {
      let reqAdapter = {
        body: request.payload, // the body of the request is accessible via the payload
        method: request.method.toUpperCase() // hapi uses lower case methods
      };

      let response = {
        code: undefined,
        headers: {}
      };

      let finishRequest = () => {
        const finalResponse = reply.response(); // only execute our request when "next" is called
        finalResponse.statusCode = response.code || resAdapter.statusCode;
        Object.keys(response.headers).forEach(header => finalResponse.header(header, response.headers[header]));
      };

      let resAdapter = {
        end: finishRequest,
        status: function(val) {
          response.code = val;

          return {
            send: finishRequest // this is implicit with hapi
          };
        },
        setHeader: function(key, value) {
          response.headers[key] = value;
        }
      };

      passwordless.requestToken(function(user, delivery, callback, req) {
        callback(null, user);
      })(reqAdapter, resAdapter, finishRequest);
    }
  });
};

module.exports = {
  setup: setupHapi,
  passwordless: passwordless
};
