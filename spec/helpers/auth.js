'use strict';

const jwt = require('jsonwebtoken');
const co = require('co');
const db = require('app/models');

module.exports = {
  getToken: co.wrap(function*() {
    let user = yield db.user.create({ email: Math.random() + '@test.com' });
    return jwt.sign({ uid: user.get('id') }, 'test');
  }),
  getExpiredToken: co.wrap(function*() {
    let user = yield db.user.create({ email: Math.random() + '@test.com' });
    return jwt.sign({ uid: user.get('id') }, 'test', { expiresIn: -1 });
  })
};
