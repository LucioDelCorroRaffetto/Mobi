module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('direcciones', [
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
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('direcciones', null, {});
  }
}; 