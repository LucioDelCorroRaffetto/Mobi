module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('imagenes', {
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
      url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      orden: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      es_principal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('imagenes');
  }
}; 