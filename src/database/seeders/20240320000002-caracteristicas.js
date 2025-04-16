"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "caracteristicas",
      [
        {
          nombre: 'Aire acondicionado',
          categoria: 'comodidades',
          icono: 'ac_unit'
        },
        {
          nombre: 'Calefacción',
          categoria: 'comodidades',
          icono: 'heating'
        },
        {
          nombre: 'Seguridad 24hs',
          categoria: 'seguridad',
          icono: 'security'
        },
        {
          nombre: 'Piscina',
          categoria: 'comodidades',
          icono: 'pool'
        },
        {
          nombre: 'Gas natural',
          categoria: 'servicios',
          icono: 'gas'
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("caracteristicas", null, {});
  }
}; 