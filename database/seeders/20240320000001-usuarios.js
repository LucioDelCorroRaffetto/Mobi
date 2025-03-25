const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@inmobiliaria.com',
        password: hashedPassword,
        tipo: 'admin',
        fecha_registro: new Date(),
        activo: true
      },
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@inmobiliaria.com',
        password: hashedPassword,
        tipo: 'agente',
        fecha_registro: new Date(),
        activo: true
      },
      {
        nombre: 'María',
        apellido: 'García',
        email: 'maria@gmail.com',
        password: hashedPassword,
        tipo: 'cliente',
        fecha_registro: new Date(),
        activo: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
}; 