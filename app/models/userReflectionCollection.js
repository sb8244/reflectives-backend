'use strict';
module.exports = function(sequelize, DataTypes) {
  var userReflectionCollection = sequelize.define('userReflectionCollection', {
    userId: DataTypes.INTEGER,
    reflectionCollectionId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return userReflectionCollection;
};
