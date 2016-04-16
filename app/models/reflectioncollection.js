'use strict';
module.exports = function(sequelize, DataTypes) {
  var ReflectionCollection = sequelize.define('reflectionCollection', {}, {
    classMethods: {
      associate: function(models) {
        models.reflectionCollection.hasMany(models.reflection);
      }
    }
  });
  return ReflectionCollection;
};
