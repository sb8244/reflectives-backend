const Controller = require('./controller');

module.exports = [{
  method: 'GET',
  path:'/reflections',
  handler: Controller.index,
  config: {
    auth: 'token'
  }
}, {
  method: 'GET',
  path:'/reflections/{id}',
  handler: Controller.show,
  config: {
    auth: 'token'
  }
}, {
  method: 'POST',
  path:'/reflections',
  handler: Controller.createCollection,
  config: {
    auth: 'token'
  }
}];
