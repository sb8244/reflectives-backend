'use strict';

const db = require('app/models/index');
const Boom = require('boom');

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
  db.sequelize.transaction((t) => {
    return db.reflectionCollection.create({
      reflections: request.payload.reflections
    }, {
      include: [ db.reflection ],
      transaction: t
    }).then((reflectionCollection) => {
      reply(reflectionCollection.toJSON());
    }).catch((errors) => {
      reply(Boom.badData('Reflections not saved due to missing data'));
    });
  });
}

module.exports = {
  index: ReflectionsIndex,
  createCollection: ReflectionsCollectionCreate
};
