'use strict';

const table = 'reflections';
const column = 'order';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      table,
      column,
      {
        type: Sequelize.INTEGER
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      table,
      column
    )
  }
};
