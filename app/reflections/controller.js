'use strict';

const db = require('app/models/index');
const Boom = require('boom');
const co = require('co');
const _ = require('lodash');

function* ReflectionsIndex(request, reply) {
  let user = request.auth.credentials;
  let collections = yield user.getReflectionCollections({
    include: [ db.reflection ],
    order: [
      [ db.reflection, 'order', 'ASC' ]
    ]
  });

  reply(collections.map(collection => {
    let json = collection.toJSON();
    json.reflections = _.sortBy(json.reflections, 'order');
    delete json.userReflectionCollection;
    return json;
  }));
}

function* ReflectionsCollectionCreate(request, reply) {
  db.sequelize.transaction((t) => {
    let user = request.auth.credentials;

    let payload = request.payload.reflections.map((params, order) => {
      params.order = order;
      return params;
    });

    return db.reflectionCollection.create({
      reflections: payload
    }, {
      include: [ db.reflection ],
      transaction: t
    }).then((reflectionCollection) => {
      return reflectionCollection.addUser(user, { transaction: t }).then(() => {
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
