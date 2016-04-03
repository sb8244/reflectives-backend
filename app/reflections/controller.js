'use strict';

const db = require('../models/index');

function ReflectionsIndex(request, reply) {
  db.Reflection.all().then(reflections => {
    let json = reflections.map(reflection => reflection.get());
    reply(json);
  });
}

function ReflectionsShow(request, reply) {
  db.Reflection.findById(request.params.id).then(reflection => {
    reply(reflection.get());
  });
}

module.exports = {
  index: ReflectionsIndex,
  show: ReflectionsShow
};
