'use strict';
module.exports = function(sequelize, DataTypes) {
  var ReflectionCollection = sequelize.define('reflectionCollection', {}, {
    classMethods: {
      associate: function(models) {
        models.reflectionCollection.hasMany(models.reflection);
        models.reflectionCollection.hasMany(models.reminder);
        models.reflectionCollection.belongsToMany(models.user, { through: models.userReflectionCollection });
      }
    }
  });
  return ReflectionCollection;
};
