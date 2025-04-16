'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    return queryInterface.bulkInsert('usuarios', [{
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@ejemplo.com',
      password: hashedPassword,
      telefono: '1155667788',
      tipo: 'cliente',
      imagen: '/images/imageDefault.png',
      fecha_registro: new Date(),
      activo: true
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('usuarios', { email: 'juan.perez@ejemplo.com' }, {});
  }
}; 