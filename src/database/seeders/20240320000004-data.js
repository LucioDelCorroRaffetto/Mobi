"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Este seeder ya no hace nada, pero lo mantenemos para no romper la secuencia
    console.log('Este seeder ha sido reemplazado por 20240320000006-visitas-y-caracteristicas.js');
  },

  async down(queryInterface, Sequelize) {
    // No hay nada que revertir
  }
}; 