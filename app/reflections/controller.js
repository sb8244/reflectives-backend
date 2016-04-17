'use strict';

const db = require('app/models/index');
const Boom = require('boom');
const co = require('co');

function* ReflectionsIndex(request, reply) {
  let user = request.auth.credentials;

  const collections = yield user.getReflectionCollections({
    include: [ db.reflection ]
  });
  reply(collections.map(collection => collection.toJSON()));
}

function* ReflectionsCollectionCreate(request, reply) {
  db.sequelize.transaction((t) => {
    let user = request.auth.credentials;

    return db.reflectionCollection.create({
      reflections: request.payload.reflections
    }, {
      include: [ db.reflection ],
      transaction: t
    }).then((reflectionCollection) => {
      reflectionCollection.addUser(user).then(() => {
        reply(reflectionCollection.toJSON());
      });
    }).catch((errors) => {
      reply(Boom.badData('Reflections not fully filled out. Try again once you fill out all reflections.'));
    });
  });
}

module.exports = {
  index: co.wrap(ReflectionsIndex),
  createCollection: co.wrap(ReflectionsCollectionCreate)
};
