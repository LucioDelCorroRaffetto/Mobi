'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = await queryInterface.sequelize.query(
      'SELECT id, tipo FROM usuarios WHERE tipo IN ("cliente", "agente")',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const cliente = usuarios.find(u => u.tipo === 'cliente');
    const agente = usuarios.find(u => u.tipo === 'agente');

    await queryInterface.bulkInsert('productos', [
      {
        direccion: 'Av. Libertador 1234',
        barrio: 'Palermo',
        zona: 'Norte',
        ambientes: 3,
        precio: 150000.00,
        tipo: 'Departamento',
        foto: '/images/budapest.jpg',
        m2: 85,
        propietario_id: cliente.id,
        agente_id: agente.id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        direccion: 'Callao 567',
        barrio: 'Recoleta',
        zona: 'Centro',
        ambientes: 4,
        precio: 200000.00,
        tipo: 'Casa',
        foto: '/images/buenaSuerteCharlie.jpg',
        m2: 120,
        propietario_id: cliente.id,
        agente_id: agente.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('productos', null, {});
  }
}; 