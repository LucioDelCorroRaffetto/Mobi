"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Hola%123', 10);
    
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        // Primero eliminamos los usuarios existentes
        await queryInterface.sequelize.query(
          `DELETE FROM usuarios WHERE email IN ('admin2@mobi.com', 'agente2@mobi.com', 'cliente2@mobi.com', 'propietario@ejemplo.com')`,
          { transaction: t }
        );

        // Luego insertamos los nuevos usuarios
        await queryInterface.sequelize.query(
          `INSERT INTO usuarios (nombre, apellido, email, password, tipo, fecha_registro, activo, telefono, created_at, updated_at) VALUES 
          ('Admin', 'Sistema', 'admin3@mobi.com', ?, 'admin', NOW(), true, '1234567890', NOW(), NOW()),
          ('Agente', 'Ventas', 'agente3@mobi.com', ?, 'agente', NOW(), true, '1234567890', NOW(), NOW()),
          ('Cliente', 'Demo', 'cliente3@mobi.com', ?, 'cliente', NOW(), true, '1234567890', NOW(), NOW()),
          ('Juan', 'Propietario', 'propietario@ejemplo.com', ?, 'cliente', NOW(), true, '1234567890', NOW(), NOW())`,
          {
            replacements: [hashedPassword, hashedPassword, hashedPassword, hashedPassword],
            type: Sequelize.QueryTypes.INSERT,
            transaction: t
          }
        );
      });
    } catch (error) {
      console.error('Error al insertar usuarios:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuarios", null, {});
  }
}; 