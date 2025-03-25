module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('direcciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      calle: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      piso: Sequelize.STRING(10),
      departamento: Sequelize.STRING(10),
      codigo_postal: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      provincia: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      pais: {
        type: Sequelize.STRING(100),
        defaultValue: 'Argentina'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('direcciones');
  }
}; 