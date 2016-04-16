'use strict';

const db = require('app/models/index');

function ReflectionsIndex(request, reply) {
  db.reflectionCollection.all({
    include: [ db.reflection ],
    order: [
      [ db.reflection, 'id', 'ASC' ]
    ]
  }).then(collection => {
    let json = collection.map(collection => collection.toJSON());
    reply(json);
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
  createCollection: ReflectionsCollectionCreate
};
