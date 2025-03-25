module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('visitas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      propiedad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propiedades',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      agente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      fecha_hora: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente','confirmada','cancelada','realizada'),
        defaultValue: 'pendiente'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('visitas');
  }
}; 