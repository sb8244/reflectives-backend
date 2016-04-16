'use strict';
module.exports = function(sequelize, DataTypes) {
  var reminder = sequelize.define('reminder', {
    reflectionCollectionId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    sendAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        models.reminder.belongsTo(models.reflectionCollection);
      }
    }
  });
  return reminder;
};
