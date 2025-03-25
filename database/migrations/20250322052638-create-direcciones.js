'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('direcciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      calle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: false
      },
      piso: {
        type: Sequelize.STRING
      },
      departamento: {
        type: Sequelize.STRING
      },
      codigo_postal: {
        type: Sequelize.STRING
      },
      ciudad: {
        type: Sequelize.STRING,
        allowNull: false
      },
      provincia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('direcciones');
  }
}; 