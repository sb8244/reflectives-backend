'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'reflections',
      'reflectionCollectionId',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'reflections',
      'reflectionCollectionId'
    )
  }
};
