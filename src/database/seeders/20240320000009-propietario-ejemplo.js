"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        // Insertamos el propietario de ejemplo
        await queryInterface.sequelize.query(
          `INSERT INTO usuarios (nombre, apellido, email, password, tipo, fecha_registro, activo, telefono, created_at, updated_at) VALUES 
          ('María', 'González', 'maria.gonzalez@ejemplo.com', ?, 'cliente', NOW(), true, '1155667788', NOW(), NOW())`,
          {
            replacements: [hashedPassword],
            type: Sequelize.QueryTypes.INSERT,
            transaction: t
          }
        );
      });
      console.log('Propietario de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error al insertar propietario:', error);
      // Si el error es por duplicado, lo ignoramos
      if (!error.name === 'SequelizeUniqueConstraintError') {
        throw error;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuarios", {
      email: 'maria.gonzalez@ejemplo.com'
    }, {});
  }
}; 