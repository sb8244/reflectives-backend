'use strict';
module.exports = function(sequelize, DataTypes) {
  var Reflection = sequelize.define('Reflection', {
    name: DataTypes.STRING,
    html: DataTypes.TEXT,
    secondsOfWriting: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'reflections'
  });
  return Reflection;
};
