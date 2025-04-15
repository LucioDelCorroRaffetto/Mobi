'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    try {
      // Primero verificamos si el email ya existe
      const [existingUser] = await queryInterface.sequelize.query(
        `SELECT id FROM usuarios WHERE email = 'propietario1@mobi.com'`
      );

      if (existingUser[0]) {
        console.log('El propietario ya existe, no es necesario crearlo');
        return;
      }

      // Si no existe, lo creamos
      await queryInterface.sequelize.query(
        `INSERT INTO usuarios (nombre, apellido, email, password, tipo, fecha_registro, activo, telefono, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), true, ?, NOW(), NOW())`,
        {
          replacements: [
            'Juan',
            'Pérez',
            'propietario1@mobi.com',
            hashedPassword,
            'cliente',
            '1155667788'
          ],
          type: Sequelize.QueryTypes.INSERT
        }
      );

      console.log('Propietario de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error al insertar propietario:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `DELETE FROM usuarios WHERE email = 'propietario1@mobi.com'`
      );
    } catch (error) {
      console.error('Error al eliminar propietario:', error);
      throw error;
    }
  }
}; 