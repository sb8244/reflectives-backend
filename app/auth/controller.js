const jwt = require('jsonwebtoken');
const Boom = require('boom');

function AuthEndpoint(request, reply) {
  if (request.passwordless) {
    jwt.sign({ uid: request.passwordless.uid }, 'shhhh', {}, function(token) {
      reply({
        token: token,
        expiresAt: (new Date()).getTime() + 60 * 60 * 24 * 1000 // 24 hours from now
      });
    });
  } else {
    reply(Boom.unauthorized('invalid authorization'));
  }
}

module.exports = {
  auth: AuthEndpoint
};
