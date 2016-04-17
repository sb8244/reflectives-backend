'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.reminder);
        models.user.belongsToMany(models.reflectionCollection, { through: models.userReflectionCollection });
      }
    }
  });
  return user;
};
