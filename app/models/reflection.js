'use strict';
module.exports = function(sequelize, DataTypes) {
  var Reflection = sequelize.define('reflection', {
    name: DataTypes.STRING,
    html: DataTypes.TEXT,
    secondsOfWriting: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.reflection.belongsTo(models.reflectionCollection);
      }
    }
  });
  return Reflection;
};
