'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'genero', {
      type: Sequelize.ENUM('masculino', 'femenino', 'otro', 'prefiero_no_decir'),
      allowNull: false,
      defaultValue: 'prefiero_no_decir'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('usuarios', 'genero');
  }
}; 