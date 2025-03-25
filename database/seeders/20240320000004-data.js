module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert('propiedades', [
        {
          titulo: 'Departamento moderno en Palermo',
          descripcion: 'Hermoso departamento con vista a la ciudad',
          tipo: 'departamento',
          precio: 150000.00,
          moneda: 'USD',
          ambientes: 3,
          dormitorios: 2,
          baños: 1,
          orientacion: 'norte',
          estado: 'disponible',
          direccion_id: 1,
          propietario_id: 3,
          agente_id: 2
        },
        {
          titulo: 'Casa familiar en Córdoba',
          descripcion: 'Amplia casa con jardín',
          tipo: 'casa',
          precio: 200000.00,
          moneda: 'USD',
          ambientes: 5,
          dormitorios: 3,
          baños: 2,
          orientacion: 'este',
          estado: 'disponible',
          direccion_id: 2,
          propietario_id: 3,
          agente_id: 2
        }
      ]);

      await queryInterface.bulkInsert('imagenes', [
        {
          propiedad_id: 1,
          url: '/images/budapest.jpg',
          descripcion: 'Vista frontal',
          orden: 1,
          es_principal: true
        },
        {
          propiedad_id: 1,
          url: '/images/casaRosada.jpg',
          descripcion: 'Cocina',
          orden: 2,
          es_principal: false
        }
      ]);

      await queryInterface.bulkInsert('visitas', [
        {
          propiedad_id: 1,
          cliente_id: 3,
          agente_id: 2,
          fecha_hora: new Date('2024-04-01 10:00:00'),
          estado: 'pendiente'
        }
      ]);

      // Relaciones propiedad-características
      await queryInterface.bulkInsert('propiedad_caracteristicas', [
        {
          propiedad_id: 1,
          caracteristica_id: 1,
          valor: 'Split'
        },
        {
          propiedad_id: 1,
          caracteristica_id: 2,
          valor: 'Central'
        }
      ]);

    } catch (error) {
      console.error('Error en el seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('propiedad_caracteristicas', null, {});
    await queryInterface.bulkDelete('visitas', null, {});
    await queryInterface.bulkDelete('imagenes', null, {});
    await queryInterface.bulkDelete('propiedades', null, {});
  }
}; 