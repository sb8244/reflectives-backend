const Controller = require('./controller');

module.exports = [{
  method: 'GET',
  path:'/auth',
  handler: Controller.auth
}];
