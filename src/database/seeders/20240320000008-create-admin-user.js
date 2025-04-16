"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nombre: 'Admin',
          apellido: 'Sistema',
          email: 'admin@mobi.com',
          password: hashedPassword,
          telefono: '1234567890',
          tipo: 'admin',
          fecha_registro: new Date(),
          activo: true
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuarios", { email: 'admin@mobi.com' }, {});
  }
}; 