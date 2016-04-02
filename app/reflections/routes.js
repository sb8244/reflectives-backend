const Controller = require('./controller');

module.exports = [{
  method: 'GET',
  path:'/reflections',
  handler: Controller.index
}, {
  method: 'GET',
  path:'/reflections/{id}',
  handler: Controller.show
}];
