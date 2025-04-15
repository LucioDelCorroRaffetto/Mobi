'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Modificamos la columna tipo a VARCHAR temporalmente
    await queryInterface.sequelize.query('ALTER TABLE propiedades MODIFY COLUMN tipo VARCHAR(255);');
    
    // Luego creamos el nuevo ENUM y modificamos la columna
    await queryInterface.changeColumn('propiedades', 'tipo', {
      type: Sequelize.ENUM('venta', 'alquiler'),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Modificamos la columna tipo a VARCHAR temporalmente
    await queryInterface.sequelize.query('ALTER TABLE propiedades MODIFY COLUMN tipo VARCHAR(255);');
    
    // Luego restauramos el ENUM original
    await queryInterface.changeColumn('propiedades', 'tipo', {
      type: Sequelize.ENUM('casa','departamento','terreno','oficina','local','garage'),
      allowNull: false
    });
  }
}; 