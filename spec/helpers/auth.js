const jwt = require('jsonwebtoken');

module.exports = {
  getToken: function(uid) {
    return jwt.sign({ uid: (uid || '1') }, 'test');;
  }
};
