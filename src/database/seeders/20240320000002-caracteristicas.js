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
          icono: 'ac_unit',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          nombre: 'Calefacción',
          categoria: 'comodidades',
          icono: 'heating',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          nombre: 'Seguridad 24hs',
          categoria: 'seguridad',
          icono: 'security',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          nombre: 'Piscina',
          categoria: 'comodidades',
          icono: 'pool',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          nombre: 'Gas natural',
          categoria: 'servicios',
          icono: 'gas',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("caracteristicas", null, {});
  }
}; 