module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propiedad_caracteristicas', {
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
      caracteristica_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'caracteristicas',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      valor: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('propiedad_caracteristicas');
  }
}; 