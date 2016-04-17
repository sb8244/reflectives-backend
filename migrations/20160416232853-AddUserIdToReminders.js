'use strict';

const table = 'reminders';
const column = 'userId';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      table,
      column,
      {
        type: Sequelize.INTEGER,
        allowNull: false
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
