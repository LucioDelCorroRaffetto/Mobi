module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('propiedades', 'barrio_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'barrios',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('propiedades', 'barrio_id');
  }
}; 