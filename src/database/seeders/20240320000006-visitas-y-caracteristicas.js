"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar si existen las propiedades antes de insertar las visitas
    const propiedades = await queryInterface.sequelize.query(
      'SELECT id FROM propiedades WHERE id = 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (propiedades.length > 0) {
      // Insertar visitas
      await queryInterface.bulkInsert(
        "visitas",
        [
          {
            propiedad_id: 1,
            cliente_id: 3,
            agente_id: 2,
            fecha_hora: new Date('2024-04-01 10:00:00'),
            estado: 'pendiente',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {}
      );

      // Insertar características de propiedades
      await queryInterface.bulkInsert(
        "propiedad_caracteristicas",
        [
          {
            propiedad_id: 1,
            caracteristica_id: 1,
            valor: 'Split',
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            propiedad_id: 1,
            caracteristica_id: 2,
            valor: 'Central',
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        {}
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("propiedad_caracteristicas", null, {});
    await queryInterface.bulkDelete("visitas", null, {});
  }
}; 