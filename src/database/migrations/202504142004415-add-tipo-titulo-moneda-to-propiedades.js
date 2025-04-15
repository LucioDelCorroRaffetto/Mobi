'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('propiedades');
    
    if (!table.tipo) {
      await queryInterface.addColumn('propiedades', 'tipo', {
        type: Sequelize.ENUM('venta', 'alquiler'),
        allowNull: false,
        defaultValue: 'venta'
      });
    }

    if (!table.titulo) {
      await queryInterface.addColumn('propiedades', 'titulo', {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: ''
      });
    }

    if (!table.moneda) {
      await queryInterface.addColumn('propiedades', 'moneda', {
        type: Sequelize.ENUM('USD', 'ARS'),
        allowNull: false,
        defaultValue: 'USD'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('propiedades');
    
    if (table.moneda) {
      await queryInterface.removeColumn('propiedades', 'moneda');
    }
    if (table.titulo) {
      await queryInterface.removeColumn('propiedades', 'titulo');
    }
    if (table.tipo) {
      await queryInterface.removeColumn('propiedades', 'tipo');
    }
    
    // Drop ENUM types if they exist
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_propiedades_tipo;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_propiedades_moneda;');
  }
}; 