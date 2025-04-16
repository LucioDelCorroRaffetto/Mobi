"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "direcciones",
      [
        {
          calle: 'Av. Libertador',
          numero: '1234',
          codigo_postal: '1425',
          ciudad: 'Buenos Aires',
          provincia: 'Buenos Aires',
          pais: 'Argentina'
        },
        {
          calle: 'Belgrano',
          numero: '567',
          piso: '3',
          departamento: 'A',
          codigo_postal: '5000',
          ciudad: 'Córdoba',
          provincia: 'Córdoba',
          pais: 'Argentina'
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("direcciones", null, {});
  }
}; 