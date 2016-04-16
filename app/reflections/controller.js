'use strict';

const db = require('app/models/index');

function ReflectionsIndex(request, reply) {
  db.reflectionCollection.all({ include: [db.reflection] }).then(collection => {
    let json = collection.map(collection => collection.toJSON());
    reply(json);
  });
}

function ReflectionsShow(request, reply) {
  db.reflection.findById(request.params.id).then(reflection => {
    if (reflection) {
      reply(reflection.get());
    } else {
      reply({ error: 'Not Found' }).code(404);
    }
  });
}

function ReflectionsCollectionCreate(request, reply) {
  db.reflectionCollection.create({
    reflections: request.payload.reflections
  }, {
    include: [ db.reflection ]
  }).then((reflectionCollection) => {
    reply(reflectionCollection.toJSON());
  });
}

module.exports = {
  index: ReflectionsIndex,
  show: ReflectionsShow,
  createCollection: ReflectionsCollectionCreate
};
