module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregamos categoria_id
    await queryInterface.addColumn('propiedades', 'categoria_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    // Agregamos m2 que también falta
    await queryInterface.addColumn('propiedades', 'm2', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Agregamos maps_url que también falta
    await queryInterface.addColumn('propiedades', 'maps_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('propiedades', 'maps_url');
    await queryInterface.removeColumn('propiedades', 'm2');
    await queryInterface.removeColumn('propiedades', 'categoria_id');
  }
}; 