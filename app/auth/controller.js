const jwt = require('jsonwebtoken');
const Boom = require('boom');

function AuthEndpoint(request, reply) {
  if (request.passwordless) {
    jwt.sign({ uid: request.passwordless.uid }, process.env.JWT_AUTH_SECRET, { expiresIn: '1 day' }, function(token) {
      reply({ token });
    });
  } else {
    reply(Boom.unauthorized('invalid authorization'));
  }
}

module.exports = {
  auth: AuthEndpoint
};
