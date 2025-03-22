'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Luchango',
        apellido: 'godo',
        email: 'santi@gmail.com',
        password: await bcrypt.hash('password123', 10),
        tipo: 'admin',
        fecha_registro: new Date(),
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Juan',
        apellido: 'Querubin',
        email: 'juan@gmail.com',
        password: await bcrypt.hash('password123', 10),
        tipo: 'agente',
        fecha_registro: new Date(),
        activo: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    await queryInterface.bulkInsert('direcciones', [
      {
        calle: 'Av. Libertador',
        numero: '2345',
        codigo_postal: '1425',
        ciudad: 'Buenos Aires',
        provincia: 'Buenos Aires',
        pais: 'Argentina',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        calle: 'Azcuénaga',
        numero: '1010',
        codigo_postal: '1424',
        ciudad: 'Buenos Aires',
        provincia: 'Buenos Aires',
        pais: 'Argentina',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    await queryInterface.bulkInsert('propiedades', [
      {
        titulo: 'Departamento en Palermo',
        descripcion: 'Hermoso departamento con vista panorámica',
        tipo: 'departamento',
        precio: 220000,
        moneda: 'USD',
        superficie_total: 100,
        superficie_cubierta: 90,
        ambientes: 4,
        estado: 'disponible',
        direccion_id: 1,
        propietario_id: 1,
        agente_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('propiedades', null, {});
    await queryInterface.bulkDelete('direcciones', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
  }
}; 