module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('caracteristicas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      categoria: {
        type: Sequelize.ENUM('general','servicios','comodidades','seguridad')
      },
      icono: Sequelize.STRING(50)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('caracteristicas');
  }
}; 