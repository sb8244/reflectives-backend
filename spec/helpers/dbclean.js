const db = require('app/models/index');

beforeEach(function(done) {
  Promise.all(Object.keys(db.models).map(modelName => {
    return db.models[modelName].truncate();
  })).then(done);
});
